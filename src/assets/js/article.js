/* =====================================================================
   article.js — le confort de lecture sur la page d'un article
   ---------------------------------------------------------------------
   1. Blocs de code : ajoute une barre avec le langage et un bouton « Copier »
   2. Titres : ajoute un petit lien « # » pour partager une section
   3. Formules : affiche les blocs ```math``` avec KaTeX
   4. Partage : complète les liens LinkedIn / WhatsApp et « Copier le lien »
   ===================================================================== */
(function () {
  "use strict";

  var prose = document.querySelector("[data-prose]");
  if (!prose) return;

  var labels = {
    copy: prose.dataset.copy || "Copy",
    copied: prose.dataset.copied || "Copied",
    anchor: prose.dataset.anchorLabel || "Link to this section"
  };

  /* Copier un texte dans le presse-papier (avec une solution de secours) */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    var area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (e) { /* rien */ }
    document.body.removeChild(area);
    return Promise.resolve();
  }

  /* ---------- 1. Blocs de code ---------- */
  prose.querySelectorAll("pre").forEach(function (pre) {
    var code = pre.querySelector("code");
    // Le langage est écrit par Eleventy dans la classe : "language-python"
    var match = (pre.className + " " + (code ? code.className : "")).match(/language-([\w+-]+)/);
    var language = match ? match[1] : "code";

    var wrapper = document.createElement("div");
    wrapper.className = "code";
    var head = document.createElement("div");
    head.className = "code-head";
    head.innerHTML = "<span></span>";
    head.firstChild.textContent = language;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-btn";
    button.textContent = labels.copy;
    button.addEventListener("click", function () {
      copyText((code || pre).innerText).then(function () {
        button.textContent = labels.copied;
        setTimeout(function () { button.textContent = labels.copy; }, 1800);
      });
    });

    head.appendChild(button);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(head);
    wrapper.appendChild(pre);
  });

  /* ---------- 2. Liens « # » à côté des titres ---------- */
  prose.querySelectorAll("h2[id], h3[id]").forEach(function (heading) {
    var link = document.createElement("a");
    link.className = "anchor";
    link.href = "#" + heading.id;
    link.textContent = "#";
    link.setAttribute("aria-label", labels.anchor);
    heading.appendChild(link);
  });

  /* ---------- 3. Formules mathématiques ---------- */
  function renderMath() {
    if (!window.katex) return false;
    prose.querySelectorAll(".math-block").forEach(function (block) {
      try {
        window.katex.render(block.textContent, block, { displayMode: true, throwOnError: false });
      } catch (e) { /* on laisse la formule en texte brut */ }
    });
    return true;
  }
  if (prose.querySelector(".math-block") && !renderMath()) {
    window.addEventListener("load", renderMath); // KaTeX pas encore chargé : on réessaie
  }

  /* ---------- 4. Partage ---------- */
  var url = window.location.href.split("#")[0];
  var title = document.querySelector(".post-title");
  var titleText = title ? title.textContent.trim() : document.title;

  var linkedin = document.querySelector('[data-share="linkedin"]');
  if (linkedin) linkedin.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
  var whatsapp = document.querySelector('[data-share="whatsapp"]');
  if (whatsapp) whatsapp.href = "https://wa.me/?text=" + encodeURIComponent(titleText + " " + url);

  // L'adresse dans la citation (utile si « siteUrl » n'est pas encore rempli)
  document.querySelectorAll("[data-page-url]").forEach(function (el) { el.textContent = url; });

  var copyLink = document.querySelector("[data-copy-link]");
  if (copyLink) {
    var text = copyLink.querySelector("span");
    var original = text.textContent;
    copyLink.addEventListener("click", function () {
      copyText(url).then(function () {
        text.textContent = copyLink.dataset.done;
        setTimeout(function () { text.textContent = original; }, 1800);
      });
    });
  }
})();
