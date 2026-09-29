/* =====================================================================
   article.11tydata.js — données calculées pour chaque page d'article
   ---------------------------------------------------------------------
   article.njk crée une page par article et par langue. Ce petit fichier
   dit au squelette (base.njk) quelle est la langue de la page, son titre,
   son résumé et son image d'aperçu, à partir de l'article affiché.
   ===================================================================== */
export default {
  eleventyComputed: {
    lang: (data) => data.entry.lang,
    title: (data) => data.entry.article.data.title,
    description: (data) => data.entry.article.data.summary,
    ogImage: (data) => data.entry.article.data.cover || "/assets/images/og-image.png"
  }
};
