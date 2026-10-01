# DAH Labs — Site web

Site du **centre d'innovation et d'incubation de Data Afrique Hub**, aux couleurs de la charte DAH Labs.
Bilingue (anglais par défaut, français), thème sombre ou clair, multipage, avec une **page d'administration** pour publier projets, articles et membres sans toucher au code.

> Vous voulez seulement **publier du contenu** (un article, un projet, un membre) ?
> Lisez plutôt **[GUIDE-CONTENU.md](GUIDE-CONTENU.md)** : pas besoin de ce fichier-ci.

---

## 1. Comment ça marche, en une image

```
  Rédacteur·rice                      GitHub                         Hébergeur
 ┌──────────────┐  enregistre   ┌──────────────────┐  déclenche  ┌──────────────────┐
 │  Admin        │ ───────────▶ │  Dépôt du site    │ ─────────▶ │  Construit le     │
 │  (Pages CMS)  │  un fichier  │  (code + contenu) │            │  site et le met   │
 │  formulaires  │              │                   │            │  en ligne (~1 min)│
 └──────────────┘               └──────────────────┘            └──────────────────┘
```

1. Dans l'**admin** ([Pages CMS](https://app.pagescms.org)), quelqu'un remplit un formulaire : « Nouvel article ».
2. L'admin enregistre un petit fichier texte dans le **dépôt GitHub** du site.
3. L'**hébergeur** (GitHub Pages conseillé) le voit, reconstruit le site avec **Eleventy** et le met en ligne.

Il n'y a **ni serveur ni base de données** à surveiller : le site en ligne n'est fait que de fichiers HTML, CSS, JavaScript et images. C'est rapide, gratuit à héberger et très difficile à pirater.

---

## 2. Un langage = un rôle = un dossier

| Langage | À quoi il sert | Où il se trouve |
|---|---|---|
| **HTML** (fichiers `.njk`) | La **structure** des pages : titres, textes, boutons, cartes | `src/_includes/` et `src/pages/` |
| **CSS** (`.css`) | L'**apparence** : couleurs de la charte, polices, mise en page, animations | `src/assets/css/` |
| **JavaScript** (`.js`) | Le **comportement** : thème ☀️/🌙, menu mobile, filtres, recherche, formulaires | `src/assets/js/` |
| **Markdown** (`.md`) | Le **contenu** : un fichier par article, projet ou membre | `src/content/` |
| **JSON / YAML** | Les **réglages** et les **textes EN/FR** de l'interface | `src/_data/`, `.pages.yml` |

**Pourquoi `.njk` et pas `.html` ?** Ce sont des fichiers HTML normaux, avec en plus quelques balises
[Nunjucks](https://mozilla.github.io/nunjucks/) pour insérer les données :

```njk
<h1>{{ t.about.hero.title1 }}</h1>              ← insère un texte (en anglais ou en français)

{% for project in collections.projects %}      ← répète la carte pour chaque projet
  {% include "partials/project-card.njk" %}
{% endfor %}
```

Eleventy remplace ces balises par le vrai contenu au moment de la construction : le visiteur reçoit du HTML pur.

---

## 3. La carte des fichiers

```
dah-labs-site/
├── README.md                  ← ce fichier (pour les développeurs)
├── GUIDE-CONTENU.md           ← le guide pour publier du contenu (non-développeurs)
├── package.json               ← la liste des outils et les commandes (npm start, npm run build)
├── eleventy.config.js         ← la configuration d'Eleventy (collections, filtres, Markdown)
├── .pages.yml                 ← la configuration de l'ADMIN (les formulaires de Pages CMS)
├── .github/workflows/deploy.yml  ← la mise en ligne automatique sur GitHub Pages
├── netlify.toml               ← la configuration si on choisit Netlify à la place
│
└── src/                       ← TOUT ce qu'on écrit est ici
    │
    ├── _data/                 ── DONNÉES (JSON)
    │   ├── i18n/en.json       ← tous les textes de l'interface en anglais
    │   ├── i18n/fr.json       ← … et en français (mêmes clés)
    │   ├── settings.json      ← réseaux sociaux, email, formulaires, chiffres (modifiable dans l'admin)
    │   └── site.json          ← langues du site, liste des icônes
    │
    ├── _includes/             ── MORCEAUX DE HTML RÉUTILISÉS
    │   ├── layouts/base.njk   ← le squelette commun : <head>, en-tête, pied de page, scripts
    │   └── partials/
    │       ├── header.njk     ← le menu du haut (logo, liens, EN/FR, ☀️/🌙)
    │       ├── footer.njk     ← le pied de page (réseaux, écosystème, newsletter)
    │       ├── project-card.njk, article-card.njk, featured-article.njk, member-card.njk
    │       ├── activity-row.njk, activity-card.njk ← une activité à venir / déjà passée
    │       ├── newsletter.njk ← l'encart « Recevez les prochains articles »
    │       ├── contribute.njk ← le bandeau bleu « Envie de contribuer ? »
    │       └── icons.njk      ← les petites icônes SVG et le motif « points de connexion »
    │
    ├── pages/                 ── LES PAGES (une par entrée du menu)
    │   ├── home.njk           → /en/            et /fr/
    │   ├── about.njk          → /en/about/      et /fr/about/
    │   ├── projects.njk       → /en/projects/   …
    │   ├── activities.njk     → /en/activities/ (webinaires, ateliers, rencontres)
    │   ├── community.njk      → /en/community/
    │   ├── blog.njk           → /en/blog/
    │   ├── article.njk        → /en/blog/<article>/  (une page par article)
    │   └── contact.njk        → /en/contact/
    ├── index.njk              → « / » : redirige vers /en/ (ou /fr/ si déjà choisi)
    ├── 404.njk                → la page « introuvable »
    ├── sitemap.njk            → le plan du site pour Google
    │
    ├── content/               ── LE CONTENU (Markdown) — rempli par l'admin
    │   ├── articles/          ← un fichier par article (texte + titre, date, catégorie…)
    │   ├── projects/          ← un fichier par projet
    │   ├── activities/        ← un fichier par activité (webinaire, atelier…)
    │   └── members/           ← un fichier par membre de l'équipe
    │
    ├── assets/
    │   ├── css/               ── STYLE (CSS), du plus général au plus précis
    │   │   ├── tokens.css     ← LA CHARTE : couleurs, polices, thèmes sombre et clair
    │   │   ├── base.css       ← réglages de base (textes, liens, accessibilité)
    │   │   ├── layout.css     ← structure : conteneur, grilles, en-tête, pied de page, mobile
    │   │   ├── components.css ← briques : boutons, cartes, étiquettes, formulaires…
    │   │   ├── animations.css ← tout ce qui bouge
    │   │   └── pages/         ← un petit fichier par page (home.css, about.css…)
    │   ├── js/                ── COMPORTEMENT (JavaScript)
    │   │   ├── theme-init.js  ← applique le thème avant l'affichage (évite un « flash »)
    │   │   ├── main.js        ← thème, langue, menu mobile, apparitions au défilement
    │   │   ├── list-filter.js ← filtres, recherche et « Voir plus » (projets et blog)
    │   │   ├── article.js     ← bouton « Copier » du code, liens de partage, formules
    │   │   └── forms.js       ← envoi des formulaires sans recharger la page
    │   └── images/            ← logos officiels DAH Labs, icônes de la charte, image de partage
    │
    ├── media/                 ← images envoyées depuis l'admin (photos, figures d'articles)
    └── static/                ← favicon (copié à la racine du site)
```

Le dossier `_site/` (créé par `npm run build`) est le **résultat** : c'est lui qui est mis en ligne. On ne le modifie jamais à la main.

---

## 4. Lancer le site sur son ordinateur

**Une seule fois :** installer [Node.js](https://nodejs.org) (version « LTS », 18 ou plus récente).

```bash
npm install     # télécharge les outils (Eleventy…) dans node_modules/
npm start       # construit le site et l'ouvre sur http://localhost:8080
```

Tant que `npm start` tourne, chaque fichier enregistré met la page à jour tout seul.
En local, les **brouillons** sont visibles (avec un badge « Draft ») pour pouvoir les relire.

```bash
npm run build   # construit la version finale dans _site/ (sans les brouillons)
```

---

## 5. Mise en ligne (à faire une seule fois)

### Étape 1 — Mettre le code sur GitHub
1. Créer un compte ou une organisation GitHub pour DAH Labs.
2. Créer un dépôt **public** (ex. `dah-labs-site`).
3. Y envoyer ce dossier (avec [GitHub Desktop](https://desktop.github.com), ou « Add file → Upload files » sur le site de GitHub). Ne pas envoyer `node_modules/` ni `_site/`.

### Étape 2 — Héberger avec GitHub Pages (conseillé)
1. Dans le dépôt : **Settings → Pages → Source : GitHub Actions**.
2. C'est tout : le fichier `.github/workflows/deploy.yml` construit et publie le site à chaque modification. On suit l'avancement dans l'onglet **Actions**.
3. Adresse : `https://<organisation>.github.io/dah-labs-site/`. Pour une adresse comme `labs.dataafriquehub.org`, l'ajouter dans **Settings → Pages → Custom domain** et demander à la personne qui gère le nom de domaine de Data Afrique Hub d'ajouter un enregistrement DNS `CNAME`.

**Pourquoi GitHub Pages ?** C'est gratuit pour un dépôt public, sans limite pratique de mises en ligne, et tout reste au même endroit que le code et l'admin.

**Mise à jour de chaque nuit.** Le site est aussi reconstruit tous les jours à 00:30 UTC, pour qu'une activité dont la date est passée quitte toute seule la liste « À venir » de la page Activités. GitHub met ces tâches planifiées en pause quand le dépôt n'a reçu aucune modification pendant 60 jours : il suffit alors de les réactiver dans l'onglet **Actions**.

**Autres hébergeurs possibles** (même réglage partout : commande `npm run build`, dossier `_site`) :
- **Netlify** : le fichier `netlify.toml` est prêt. Attention, l'offre gratuite compte des « crédits » : environ **20 mises en ligne par mois**, et chaque enregistrement dans l'admin en déclenche une. Si les crédits sont épuisés, le site est mis en pause jusqu'au mois suivant.
- **Cloudflare Pages** ou l'hébergement de Data Afrique Hub : copier le contenu de `_site/` après `npm run build`.

### Étape 3 — Brancher l'admin (Pages CMS)
1. Aller sur **[app.pagescms.org](https://app.pagescms.org)** et se connecter avec GitHub.
2. Autoriser l'application Pages CMS sur le dépôt `dah-labs-site`.
3. Ouvrir le dépôt : les formulaires **Articles du blog**, **Projets**, **Activités**, **Membres de l'équipe** et **Réglages du site** apparaissent (ils sont décrits dans `.pages.yml`).
4. Inviter les rédacteurs : dans Pages CMS, **Collaborators** → leur adresse email. **Ils n'ont pas besoin de compte GitHub.**

### Étape 4 — Brancher les formulaires (contact, proposer un projet, newsletter)
Un site sans serveur ne peut pas recevoir de messages lui-même : on passe par un service de formulaires.
1. Créer un compte sur **[Formspree](https://formspree.io)** et créer 3 formulaires : « Contact », « Proposer un projet », « Newsletter ».
2. Copier leurs adresses (du type `https://formspree.io/f/abcdwxyz`).
3. Les coller dans l'admin : **Réglages du site → Adresses d'envoi des formulaires**.

Les messages arrivent alors par email. L'offre gratuite de Formspree compte 50 envois par mois : suffisant pour démarrer. Tant qu'une adresse est vide, le formulaire affiche poliment « pas encore branché ».
Pour une vraie newsletter (envoi d'emails à tous les abonnés), on pourra plus tard remplacer l'adresse « Newsletter » par celle d'un outil comme Brevo ou Mailchimp.

### Étape 5 — Remplir les réglages
Dans **Réglages du site** : adresse du site, email de contact, liens LinkedIn / WhatsApp / X / GitHub, liens DAH Academy et DAH Média, chiffres clés de la page À propos.

---

## 6. Les langues (EN / FR)

- Chaque page existe deux fois : `/en/…` et `/fr/…`. Le bouton **EN/FR** mène à la même page dans l'autre langue. L'anglais est la langue par défaut ; le choix du visiteur est mémorisé.
- **Textes de l'interface** (menus, titres, boutons) : `src/_data/i18n/en.json` et `fr.json`. Les deux fichiers ont exactement les mêmes clés : pour modifier un texte, le changer dans les deux.
- **Projets et membres** : l'admin propose un champ par langue (ex. « Description (français) » et « Description (English) »). Si l'anglais est vide, le français s'affiche.
- **Articles** : un article est écrit dans **une** langue. Il est visible dans les deux versions du blog (avec un badge « FR » ou « EN » et un petit avis). Pour le traduire : créer un second article dans l'autre langue et donner aux deux la même **clé de traduction** (ex. `rag-langchain`) : chaque visiteur verra alors la version de sa langue.

## 7. Le thème clair / sombre

- Le thème **sombre** est affiché par défaut ; le bouton ☀️/🌙 permet de changer, et le choix est mémorisé.
- Pour mettre le **clair** par défaut : dans `src/assets/js/theme-init.js`, remplacer `var theme = "dark";` par `var theme = "light";`, et dans `src/_includes/layouts/base.njk`, `data-theme="dark"` par `data-theme="light"`.
- Toutes les couleurs des deux thèmes sont dans `src/assets/css/tokens.css`.

## 8. Respect de la charte DAH Labs

- Couleurs officielles uniquement (bleu `#1370EA`, orange `#F76622`, noir `#1C1C1C`, blanc, dégradé `#127EFF → #0563D2`), définies dans `tokens.css`.
- Polices Open Sans (titres) et Inter (texte).
- Logo blanc sur fond sombre, logo couleur sur fond clair, jamais déformé, animé ni séparé de son texte. Le symbole seul n'est utilisé que pour le favicon (petit format), comme le permet la charte.
- Les 6 icônes officielles (Innovation, Recherche, Collaboration, Données, Impact, Communauté) sont dans `src/assets/images/icons/`.

---

## 9. Tâches courantes pour un développeur

**Ajouter une page** (ex. « Événements ») :
1. Copier `src/pages/contact.njk` en `src/pages/events.njk` ; changer `permalink` (`/{{ lang }}/events/`) et `pageKey` (`events`).
2. Ajouter ses textes dans `i18n/en.json` et `i18n/fr.json` (un bloc `"events": { … }`), plus `"events"` dans `meta.titles`.
3. Ajouter le lien dans le menu : `src/_includes/partials/header.njk` (liste `menu`) et, si besoin, dans `footer.njk`.
4. Si la page a son propre style : créer `src/assets/css/pages/events.css` et l'indiquer dans `styles:`.

**Ajouter un champ à un formulaire de l'admin** (ex. un lien vidéo pour les projets) :
1. Le déclarer dans `.pages.yml` (section `projects`).
2. L'afficher dans le gabarit concerné (`partials/project-card.njk`) : `{{ project.data.video }}`.

**Changer une couleur de la charte** : uniquement dans `src/assets/css/tokens.css`.

**Ajouter une langue** : ajouter le code dans `src/_data/site.json` (`languages`), créer `i18n/<code>.json` en copiant `en.json`, et ajouter les champs `_<code>` dans `.pages.yml`.

---

## 10. Avant l'ouverture au public : ce qui reste à remplir

Le site contient des **contenus d'exemple**, à compléter ou remplacer depuis l'admin :

- [ ] **Membres** : 8 fiches « [Nom complet] » en brouillon → remplir nom, rôle, photo, liens, puis décocher « Brouillon ».
- [ ] **Projets** : Hub RAG Assistant → ajouter les liens GitHub et démo (Afrinutri est privé : présenté sans lien). 4 projets d'exemple en brouillon à remplir ou supprimer.
- [ ] **Articles** : l'article RAG (EN + FR) est publié. 9 articles en brouillon contiennent un plan à rédiger (dont un « guide express » pour écrire sur le blog).
- [ ] **Activités** : annoncer les premiers webinaires. Les 2 activités d'exemple en brouillon sont à supprimer.
- [ ] **Réglages du site** : liens X, DAH Academy et DAH Média.
- [ ] **Formulaires** : créer les 3 formulaires Formspree et coller leurs adresses.
- [ ] **Version mobile** : le site s'adapte déjà aux téléphones (menu ☰, colonnes empilées). Une passe de finition est prévue après validation de la version bureau.

---

## 11. Outils utilisés

| Outil | Rôle | Documentation |
|---|---|---|
| Eleventy 3 | Assemble les pages HTML à partir des gabarits et du contenu | [11ty.dev](https://www.11ty.dev/docs/) |
| Nunjucks | Les balises `{{ }}` et `{% %}` dans les fichiers `.njk` | [mozilla.github.io/nunjucks](https://mozilla.github.io/nunjucks/templating.html) |
| Pages CMS | L'admin (formulaires) branché sur GitHub | [pagescms.org/docs](https://pagescms.org/docs/) |
| Prism (via le plugin Eleventy) | Coloration du code dans les articles | [plugin syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/) |
| KaTeX | Affichage des formules mathématiques | [katex.org](https://katex.org/) |
| Formspree | Réception des formulaires par email | [formspree.io](https://formspree.io) |

Aucun framework JavaScript (React, Vue…) : le JavaScript du site est volontairement simple et commenté, pour qu'il reste lisible par toute l'équipe.
