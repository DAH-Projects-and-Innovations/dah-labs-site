/* =====================================================================
   Code.gs — réception des formulaires du site DAH Labs
   ---------------------------------------------------------------------
   Ce script Google Apps Script reçoit les 3 formulaires du site
   (contact, « Proposer un projet », newsletter) et :
     • range chaque message dans un onglet d'une Google Sheet ;
     • envoie un email d'alerte pour les messages de contact et les projets ;
     • ignore les robots (champ piège « _gotcha », envoi trop rapide) ;
     • limite le nombre d'envois par adresse email et par heure ;
     • n'inscrit pas deux fois la même adresse à la newsletter.

   Il est installé dans la Google Sheet elle-même (Extensions → Apps Script)
   et publié comme « Application Web ». Voir apps-script/README.md.

   Côté site : src/assets/js/forms.js envoie les formulaires ici, et lit
   la réponse { ok: true } ou { ok: false, error: "…" }.
   ===================================================================== */

/* ---------- Réglages (à adapter) ---------- */
const CONFIG = {
  // Qui reçoit les alertes « nouveau message » (plusieurs : séparer par des virgules)
  NOTIFY_EMAIL: "dataafriquehub@gmail.com",

  // Vide = la Google Sheet dans laquelle le script est installé.
  // Sinon, l'identifiant d'une autre feuille (le long code dans son adresse).
  SPREADSHEET_ID: "",

  // Anti-robots : un humain met plus de 3 secondes à remplir un formulaire
  MIN_ELAPSED_MS: 3000,

  // Limites, pour qu'un robot ne remplisse pas la feuille ni la boîte mail
  MAX_FIELD_LENGTH: 5000,      // caractères par champ (le reste est coupé)
  MAX_PER_EMAIL_PER_HOUR: 5,   // envois par adresse email
  MAX_PER_HOUR: 60             // envois au total, tous formulaires confondus
};

/* ---------- Les formulaires connus ----------
   La clé est la valeur du champ caché « _form » dans le HTML du site. */
const FORMS = {
  "contact": {
    sheet: "Contact",
    label: "Message de contact",
    required: ["name", "email", "message"],
    notify: true
  },
  "propose-project": {
    sheet: "Projets proposés",
    label: "Proposition de projet",
    required: ["name", "email", "project", "description"],
    notify: true
  },
  "newsletter": {
    sheet: "Newsletter",
    label: "Inscription à la newsletter",
    required: ["email"],
    notify: false,
    uniqueEmail: true          // une adresse déjà inscrite n'est pas ajoutée à nouveau
  }
};

/* =====================================================================
   Point d'entrée : appelé à chaque envoi de formulaire depuis le site
   ===================================================================== */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const params = (e && e.parameter) || {};
    const form = FORMS[params._form];
    if (!form) return reply(false, "unknown-form");

    // Robots : on répond « ok » pour ne pas leur indiquer qu'ils ont été repérés
    if (params._gotcha) return reply(true);
    if (!(Number(params._elapsed) >= CONFIG.MIN_ELAPSED_MS)) return reply(true);

    const email = String(params.email || "").trim().toLowerCase();
    if (!isEmail(email)) return reply(false, "invalid-email");
    for (const field of form.required) {
      if (!String(params[field] || "").trim()) return reply(false, "missing-" + field);
    }
    if (isRateLimited(email)) return reply(false, "rate-limited");

    // Un seul envoi écrit dans la feuille à la fois (évite les lignes mélangées)
    lock.waitLock(10000);
    const sheet = getSheet(form.sheet);
    if (form.uniqueEmail && hasEmail(sheet, email)) return reply(true);
    const record = appendRecord(sheet, params, email);
    lock.releaseLock();

    if (form.notify) notify(form, record, email);
    return reply(true);
  } catch (err) {
    console.error(err);
    return reply(false, "server-error");
  } finally {
    lock.releaseLock();
  }
}

/* Ouvrir l'adresse du script dans un navigateur affiche ce message :
   pratique pour vérifier que la publication a marché. */
function doGet() {
  return ContentService.createTextOutput("DAH Labs : réception des formulaires active.");
}

/* =====================================================================
   Petites fonctions utilitaires
   ===================================================================== */

// Réponse lue par forms.js
function reply(ok, error) {
  const body = ok ? { ok: true } : { ok: false, error: error };
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function isEmail(text) {
  return text.length <= 254 && /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(text);
}

// Compte les envois de la dernière heure (mémoire temporaire de Google)
function isRateLimited(email) {
  const cache = CacheService.getScriptCache();
  const keys = ["count:" + email, "count:all"];
  const counts = cache.getAll(keys);
  const perEmail = Number(counts[keys[0]] || 0);
  const total = Number(counts[keys[1]] || 0);
  if (perEmail >= CONFIG.MAX_PER_EMAIL_PER_HOUR || total >= CONFIG.MAX_PER_HOUR) return true;
  cache.putAll({ [keys[0]]: String(perEmail + 1), [keys[1]]: String(total + 1) }, 3600);
  return false;
}

// L'onglet du formulaire, créé avec sa première colonne s'il n'existe pas encore
function getSheet(name) {
  const book = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(["Date"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1).setFontWeight("bold");
  }
  return sheet;
}

function hasEmail(sheet, email) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = headers.indexOf("email");
  if (col === -1 || sheet.getLastRow() < 2) return false;
  const emails = sheet.getRange(2, col + 1, sheet.getLastRow() - 1, 1).getValues();
  return emails.some((row) => String(row[0]).trim().toLowerCase() === email);
}

/* Ajoute une ligne. Les colonnes suivent les champs du formulaire : si le
   site ajoute un champ, une nouvelle colonne apparaît toute seule.
   Les champs qui commencent par « _ » (techniques) ne sont pas gardés. */
function appendRecord(sheet, params, email) {
  const record = { Date: new Date() };
  for (const key of Object.keys(params)) {
    if (key.charAt(0) !== "_") record[key] = clean(params[key]);
  }
  record.email = email;

  const headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  for (const key of Object.keys(record)) {
    if (headers.indexOf(key) === -1) {
      headers.push(key);
      sheet.getRange(1, headers.length).setValue(key).setFontWeight("bold");
    }
  }
  sheet.appendRow(headers.map((h) => (h in record ? record[h] : "")));
  return record;
}

/* Coupe les textes trop longs, et empêche qu'un texte commençant par
   « = », « + », « - » ou « @ » soit pris pour une formule par la feuille. */
function clean(value) {
  let text = String(value).slice(0, CONFIG.MAX_FIELD_LENGTH);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

// Email d'alerte : « Répondre » écrit directement à la personne
function notify(form, record, email) {
  const lines = Object.keys(record)
    .filter((key) => key !== "Date")
    .map((key) => key + " : " + String(record[key]).replace(/^'/, ""));
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    replyTo: email,
    subject: "[DAH Labs] " + form.label + (record.name ? " de " + String(record.name).replace(/^'/, "") : ""),
    body: lines.join("\n\n") + "\n\n—\nReçu via le site DAH Labs. Tous les messages sont dans la Google Sheet."
  });
}

/* =====================================================================
   À lancer une fois depuis l'éditeur (bouton « Exécuter ») :
   Google demande les autorisations, puis une ligne de test apparaît
   dans l'onglet « Contact » et un email d'alerte est envoyé.
   ===================================================================== */
function testerLeFormulaire() {
  const result = doPost({
    parameter: {
      _form: "contact",
      _elapsed: "10000",
      name: "Test",
      email: CONFIG.NOTIFY_EMAIL.split(",")[0].trim(),
      subject: "Test",
      message: "Ceci est un message de test envoyé depuis l'éditeur Apps Script.",
      language: "fr"
    }
  });
  console.log(result.getContent());
}
