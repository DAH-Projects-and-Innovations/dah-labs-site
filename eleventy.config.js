/* =====================================================================
   eleventy.config.js — la « salle des machines » du site
   ---------------------------------------------------------------------
   Eleventy lit les dossiers de `src/`, assemble les pages HTML et les
   écrit dans `_site/` (le dossier qu'on met en ligne).

   Ce fichier lui dit :
     1. quels fichiers copier tels quels (images, CSS, JS) ;
     2. comment regrouper le contenu (projets, articles, membres) ;
     3. quelles petites fonctions (« filtres ») les pages peuvent utiliser ;
     4. comment transformer le Markdown des articles en HTML.

   Normalement, personne n'a besoin de modifier ce fichier pour publier
   du contenu : tout se fait depuis l'admin (Pages CMS).
   ===================================================================== */

import { HtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

// Les langues du site. La première est la langue par défaut.
const LANGS = ["en", "fr"];

// En mode « npm start » (serveur local), on affiche aussi les brouillons
// pour pouvoir les relire. En ligne (« npm run build »), ils sont cachés.
const SHOW_DRAFTS = process.env.ELEVENTY_RUN_MODE === "serve" || process.env.SHOW_DRAFTS === "1";

/* ---------- Petites fonctions utilitaires ---------- */

// Transforme « Qu'est-ce que le RAG ? » en « qu-est-ce-que-le-rag »
function slugify(text) {
  return String(text)
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // enlève les accents
    .toLowerCase()
    .replace(/<[^>]*>/g, "")                         // enlève d'éventuelles balises
    .replace(/[^a-z0-9]+/g, "-")                     // tout le reste devient « - »
    .replace(/^-+|-+$/g, "");
}

// Un contenu est visible s'il n'est pas marqué comme brouillon
const isVisible = (item) => SHOW_DRAFTS || !item.data.draft;

// Tri : d'abord le champ « order » (si rempli), puis la date la plus récente
const byOrderThenDate = (a, b) => {
  const oa = a.data.order ?? 999, ob = b.data.order ?? 999;
  if (oa !== ob) return oa - ob;
  return (b.date || 0) - (a.date || 0);
};

export default function (eleventyConfig) {
  /* Si le site est publié dans un sous-dossier (ex. GitHub Pages sans nom
     de domaine : https://dah-labs.github.io/dah-labs-site/), ce plugin
     ajoute automatiquement ce sous-dossier devant tous les liens. */
  eleventyConfig.addPlugin(HtmlBasePlugin);

  /* =================================================================
     1. Fichiers copiés tels quels dans _site/
     ================================================================= */
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" }); // CSS, JS, logos, icônes
  eleventyConfig.addPassthroughCopy({ "src/media": "media" });   // images envoyées depuis l'admin
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });      // favicon, etc. à la racine
  // KaTeX (affichage des formules mathématiques), servi par le site lui-même
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/katex.min.js": "assets/vendor/katex/katex.min.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/katex.min.css": "assets/vendor/katex/katex.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/fonts/*.woff2": "assets/vendor/katex/fonts" });

  /* =================================================================
     2. Collections : les « listes » de contenu utilisées par les pages
     ================================================================= */

  // Tous les projets (dossier src/content/projects)
  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByGlob("src/content/projects/*.md").filter(isVisible).sort(byOrderThenDate)
  );

  // Tous les membres de l'équipe (dossier src/content/members)
  eleventyConfig.addCollection("members", (api) =>
    api.getFilteredByGlob("src/content/members/*.md").filter(isVisible).sort(byOrderThenDate)
  );

  // Toutes les activités (webinaires, ateliers…), de la plus proche à la plus lointaine
  eleventyConfig.addCollection("activities", (api) =>
    api.getFilteredByGlob("src/content/activities/*.md").filter(isVisible).sort((a, b) => a.date - b.date)
  );

  // Tous les articles, du plus récent au plus ancien
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/content/articles/*.md").filter(isVisible).sort((a, b) => b.date - a.date)
  );

  /* « articlePages » : une page par article ET par langue du site.
     Un article est écrit dans une langue (champ « lang »). S'il existe une
     traduction (même « translationKey »), on affiche la bonne version selon
     la langue du visiteur ; sinon on affiche l'original avec un petit avis.
     Résultat : /en/blog/mon-article/ et /fr/blog/mon-article/ existent
     toujours, et le bouton EN/FR fonctionne partout. */
  eleventyConfig.addCollection("articlePages", (api) => {
    const articles = api.getFilteredByGlob("src/content/articles/*.md").filter(isVisible);

    // On regroupe les versions d'un même article
    const groups = new Map();
    for (const item of articles) {
      const key = item.data.translationKey ? slugify(item.data.translationKey) : item.fileSlug;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    const pages = [];
    for (const lang of LANGS) {
      for (const [slug, versions] of groups) {
        const article = versions.find((v) => v.data.lang === lang) || versions[0];
        pages.push({
          lang,                                  // langue de l'interface
          slug,                                  // morceau d'adresse : /en/blog/<slug>/
          url: `/${lang}/blog/${slug}/`,
          article,                               // le fichier Markdown à afficher
          isFallback: article.data.lang !== lang // vrai si l'article n'est pas traduit
        });
      }
    }
    // Du plus récent au plus ancien
    return pages.sort((a, b) => b.article.date - a.article.date);
  });

  /* =================================================================
     3. Filtres : de petites fonctions utilisables dans les pages
        Exemple dans un fichier .njk :  {{ project.data | tr("summary", lang) }}
     ================================================================= */

  // Choisit le champ dans la bonne langue : summary_en ou summary_fr.
  // Si la traduction est vide, on prend l'autre langue plutôt que rien.
  eleventyConfig.addFilter("tr", (data, field, lang) => {
    if (!data) return "";
    const other = LANGS.find((l) => l !== lang);
    return data[`${field}_${lang}`] || data[`${field}_${other}`] || data[field] || "";
  });

  // Date lisible selon la langue : « 12 September 2026 » / « 12 septembre 2026 »
  eleventyConfig.addFilter("readableDate", (date, lang = "en", style = "long") => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    const formats = {
      short: { day: "numeric", month: "short", timeZone: "UTC" },                 // 12 sept.
      month: { month: "long", year: "numeric", timeZone: "UTC" },                 // septembre 2026
      long: { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },  // 12 septembre 2026
      full: { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }, // samedi 12 septembre 2026
      day: { day: "numeric", timeZone: "UTC" },                                   // 12 (pavé « calendrier »)
      monthShort: { month: "short", timeZone: "UTC" }                             // sept.
    };
    const options = formats[style] || formats.long;
    return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", options).format(d);
  });

  // Date au format machine (pour la balise <time datetime="…">)
  eleventyConfig.addFilter("isoDate", (date) => (date ? new Date(date).toISOString().slice(0, 10) : ""));

  // Année : {{ page.date | year }}, ou {{ "now" | year }} pour l'année en cours
  eleventyConfig.addFilter("year", (date) => {
    if (!date) return "";
    return (date === "now" ? new Date() : new Date(date)).getUTCFullYear();
  });

  // Temps de lecture estimé (≈ 220 mots par minute)
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  });

  // Garde seulement les N premiers éléments d'une liste
  eleventyConfig.addFilter("limit", (list, n) => (list || []).slice(0, n));

  // Garde les éléments dont item[key] vaut value (ex. articlePages | where("lang", "fr"))
  eleventyConfig.addFilter("where", (list, key, value) => (list || []).filter((x) => x[key] === value));

  // Même chose, mais sur un champ du contenu (ex. projects | whereData("status", "live"))
  eleventyConfig.addFilter("whereData", (list, key, value) => (list || []).filter((x) => x.data && x.data[key] === value));

  // Pour les pages d'articles (ex. articles | whereArticle("category", "tuto"))
  eleventyConfig.addFilter("whereArticle", (list, key, value) => (list || []).filter((x) => x.article.data[key] === value));

  // Garde les pages d'articles « à la une »
  eleventyConfig.addFilter("featuredFirst", (list) => {
    const featured = (list || []).find((p) => p.article.data.featured);
    return featured || (list || [])[0] || null;
  });

  // Activités à venir (celles du jour comprises) ou déjà passées, d'après la date
  // du jour où le site est construit. Le site est reconstruit chaque nuit
  // (voir .github/workflows/deploy.yml) : une activité passe donc toute seule
  // dans « Déjà passées » le lendemain de sa date.
  const startOfToday = () => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); return d; };
  eleventyConfig.addFilter("upcoming", (list) => (list || []).filter((x) => x.date >= startOfToday()));
  eleventyConfig.addFilter("past", (list) => (list || []).filter((x) => x.date < startOfToday()).reverse());

  // Enlève un élément d'une liste (ex. l'article à la une de la grille)
  eleventyConfig.addFilter("without", (list, item) => (list || []).filter((x) => x !== item));

  // Remplace {n} dans un texte : "{n} membres" → "8 membres"
  eleventyConfig.addFilter("fill", (text, n) => String(text || "").replace("{n}", n));

  // Article plus récent / plus ancien dans la même langue (repéré par son adresse)
  eleventyConfig.addFilter("neighbours", (list, url) => {
    const i = (list || []).findIndex((x) => x.url === url);
    return { newer: i > 0 ? list[i - 1] : null, older: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
  });

  // Sommaire de l'article : les titres ## (niveau 2), avec leurs sous-titres ### rangés dessous
  eleventyConfig.addFilter("toc", (html) => {
    const items = [];
    const re = /<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    let m;
    while ((m = re.exec(String(html || "")))) {
      const heading = { id: m[2], text: m[3].replace(/<[^>]*>/g, "").trim(), children: [] };
      if (m[1] === "3" && items.length) items[items.length - 1].children.push(heading);
      else items.push(heading);
    }
    return items;
  });

  // Activité récente pour le panneau de l'accueil (projets + articles mélangés)
  eleventyConfig.addFilter("recentActivity", (projects, articlePages, lang, n = 4) => {
    const fromProjects = (projects || []).map((p) => ({
      kind: "project", title: p.data.title, date: p.date, icon: p.data.icon || "innovation", url: `/${lang}/projects/`
    }));
    const fromArticles = (articlePages || []).filter((a) => a.lang === lang).map((a) => ({
      kind: "article", title: a.article.data.title, date: a.article.date, icon: a.article.data.icon || "recherche", url: a.url
    }));
    return [...fromProjects, ...fromArticles].sort((a, b) => b.date - a.date).slice(0, n);
  });

  // Texte pour les recherches du blog (titre + résumé + mots-clés, en minuscules)
  eleventyConfig.addFilter("searchText", (data) =>
    [data.title, data.summary, (data.tags || []).join(" ")].join(" ").toLowerCase()
  );

  // Adresse du lien principal d'un projet : la démo, sinon GitHub, sinon rien
  eleventyConfig.addFilter("projectLink", (data) => {
    const ok = (u) => u && u !== "#";
    return ok(data.demo) ? data.demo : ok(data.github) ? data.github : "";
  });

  // Vrai si un lien est rempli (pas vide ni « # »)
  eleventyConfig.addFilter("isLink", (u) => Boolean(u && u !== "#"));

  /* =================================================================
     4. Markdown → HTML (pour les articles)
     ================================================================= */

  // Coloration du code (Python, SQL, R…) au moment de la construction
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ html: true, linkify: true });

    // Ajoute un identifiant à chaque titre (## Mon titre → id="mon-titre")
    // pour le sommaire et les liens directs vers une section.
    md.core.ruler.push("heading_ids", (state) => {
      const used = {};
      state.tokens.forEach((token, i) => {
        if (token.type !== "heading_open") return;
        let id = slugify(state.tokens[i + 1].content) || "section";
        used[id] = (used[id] || 0) + 1;
        if (used[id] > 1) id += `-${used[id]}`;
        token.attrSet("id", id);
      });
    });

    // Bloc ```math … ``` : formule mathématique affichée avec KaTeX (voir article.js)
    const defaultFence = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.info.trim() === "math") {
        return `<div class="math-block">${md.utils.escapeHtml(token.content)}</div>\n`;
      }
      return defaultFence(tokens, idx, options, env, self);
    };
  });

  /* =================================================================
     Réglages généraux
     ================================================================= */
  return {
    dir: {
      input: "src",          // tout ce qu'on écrit
      output: "_site",       // le site construit (à mettre en ligne)
      includes: "_includes", // morceaux de HTML réutilisables
      data: "_data"          // textes EN/FR et réglages du site
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    // Le Markdown des articles est pris tel quel (on ne cherche pas de {{ }} dedans)
    markdownTemplateEngine: false
  };
}
