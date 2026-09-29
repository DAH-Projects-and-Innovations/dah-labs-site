/* =====================================================================
   theme-init.js — applique le thème clair/sombre le plus tôt possible
   ---------------------------------------------------------------------
   Ce petit fichier est chargé dans le <head>, AVANT l'affichage de la
   page. Sinon, un visiteur qui a choisi le thème clair verrait d'abord
   la page en sombre pendant une fraction de seconde (un « flash »).

   Le choix du visiteur est mémorisé dans son navigateur (localStorage)
   sous le nom « dah-theme ». Par défaut : sombre.
   ===================================================================== */
(function () {
  var theme = "dark";
  try {
    var saved = localStorage.getItem("dah-theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch (e) {
    /* navigation privée : on garde le thème par défaut */
  }
  document.documentElement.setAttribute("data-theme", theme);
})();
