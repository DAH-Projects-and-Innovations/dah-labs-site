/* =====================================================================
   list-filter.js — listes filtrables (page Projets et page Blog)
   ---------------------------------------------------------------------
   Toutes les cartes sont déjà dans la page (écrites par Eleventy).
   Ce script se contente de montrer / cacher des cartes :
     • les boutons de catégorie (« Tous », « En cours »…) ;
     • la recherche par mot-clé (blog) ;
     • le bouton « Voir plus » qui affiche la suite de la liste.

   Il lit ses réglages dans les attributs data-… du HTML :
     data-list              → la zone à gérer
     data-filter-key        → "status" (projets) ou "category" (blog)
     data-page-size         → nombre de cartes affichées au départ
     data-label-many / -one → texte du compteur, ex. "{n} articles"
   ===================================================================== */
(function () {
  "use strict";

  document.querySelectorAll("[data-list]").forEach(setupList);

  function setupList(list) {
    var key = list.dataset.filterKey;                 // "status" ou "category"
    var pageSize = parseInt(list.dataset.pageSize, 10) || 9;
    var grid = list.querySelector("[data-items]");
    if (!grid) return;

    var items = Array.prototype.slice.call(grid.children);   // toutes les cartes
    var chips = list.querySelectorAll("[data-filter]");
    var featured = list.querySelector("[data-featured]");     // grande carte « à la une »
    var empty = list.querySelector("[data-empty]");
    var more = list.querySelector("[data-more]");
    var counter = list.querySelector("[data-count]");
    var search = document.querySelector("[data-search-input]");

    // L'état de la liste : filtre choisi, texte cherché, nombre de cartes visibles
    var state = { filter: "all", query: "", limit: pageSize };

    // Les infos de chaque carte (data-status, data-category, data-search)
    function infoOf(item) {
      return item.matches("[data-" + key + "]") ? item : item.querySelector("[data-" + key + "]");
    }

    function matches(item) {
      var info = infoOf(item);
      if (!info) return false;
      var okFilter = state.filter === "all" || info.getAttribute("data-" + key) === state.filter;
      var okQuery = !state.query || (info.dataset.search || info.textContent.toLowerCase()).indexOf(state.query) !== -1;
      return okFilter && okQuery;
    }

    function render() {
      // Sans filtre ni recherche : la grande carte « à la une » est affichée
      // et son double dans la grille reste caché.
      var isDefault = state.filter === "all" && !state.query;
      if (featured) featured.hidden = !isDefault;

      var visible = items.filter(function (item) {
        if (isDefault && item.hasAttribute("data-featured-copy")) return false;
        return matches(item);
      });

      items.forEach(function (item) { item.hidden = true; });
      visible.slice(0, state.limit).forEach(function (item) { item.hidden = false; });

      var total = visible.length + (isDefault && featured ? 1 : 0);
      if (counter) {
        var label = total === 1 ? list.dataset.labelOne : list.dataset.labelMany;
        counter.textContent = (label || "{n}").replace("{n}", total);
      }
      if (empty) empty.hidden = total !== 0;
      if (more) more.hidden = visible.length <= state.limit;
    }

    // Clic sur une catégorie
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.filter = chip.dataset.filter;
        state.limit = pageSize;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        render();
      });
    });

    // Recherche : on filtre à chaque lettre tapée
    if (search) {
      search.addEventListener("input", function () {
        state.query = search.value.trim().toLowerCase();
        state.limit = pageSize;
        render();
      });
    }

    // « Voir plus » : on affiche une page de cartes en plus
    if (more) {
      more.querySelector("button").addEventListener("click", function () {
        state.limit += pageSize;
        render();
      });
    }

    render();
  }
})();
