/* =====================================================================
   main.js — le JavaScript commun à toutes les pages
   ---------------------------------------------------------------------
   1. Bouton ☀️/🌙 : changer de thème et s'en souvenir
   2. Bouton EN/FR : se souvenir de la langue choisie
   3. Menu ☰ sur mobile : ouvrir / fermer
   4. Apparition des blocs quand on fait défiler la page
   5. Halo lumineux qui suit la souris sur les cartes
   Sans JavaScript, le site reste entièrement lisible : ce fichier
   ajoute seulement du confort.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  /* Petite aide : lire / écrire dans la mémoire du navigateur sans planter
     (la mémoire peut être bloquée en navigation privée). */
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* rien */ }
  }

  /* ---------------------------------------------------------------
     1. Thème clair / sombre
     --------------------------------------------------------------- */
  var themeButtons = document.querySelectorAll("[data-set-theme]");

  function showTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.setTheme === theme));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#FFFFFF" : "#031225");
  }

  showTheme(root.getAttribute("data-theme") || "dark"); // état de départ (posé par theme-init.js)

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showTheme(btn.dataset.setTheme);
      remember("dah-theme", btn.dataset.setTheme);
    });
  });

  /* ---------------------------------------------------------------
     2. Langue : on mémorise le choix (utilisé par la page d'accueil « / »)
     --------------------------------------------------------------- */
  if (!document.body.classList.contains("page-notFound")) remember("dah-lang", root.lang);
  document.querySelectorAll("[data-set-lang]").forEach(function (link) {
    link.addEventListener("click", function () {
      remember("dah-lang", link.dataset.setLang);
    });
  });

  /* ---------------------------------------------------------------
     3. Menu mobile
     --------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-menu-toggle]");

  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    // On referme le menu avec la touche Échap ou en cliquant sur un lien
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------------------------------------------------------------
     4. Apparition au défilement
     Les éléments marqués data-reveal apparaissent en douceur quand ils
     entrent à l'écran. On ne l'active pas si le visiteur a demandé
     « moins d'animations » ou si le navigateur est trop ancien.
     --------------------------------------------------------------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    root.setAttribute("data-anim", "on");
    var observerWorks = false;

    var observer = new IntersectionObserver(function (entries) {
      observerWorks = true;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-in", "");
          observer.unobserve(entry.target); // une seule fois
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll("[data-reveal]").forEach(function (el) { observer.observe(el); });

    // Sécurité : si l'observateur ne répond pas (vieux navigateur,
    // impression, capture d'écran…), on montre tout après 2,5 s.
    setTimeout(function () {
      if (!observerWorks) root.removeAttribute("data-anim");
    }, 2500);
  }

  /* ---------------------------------------------------------------
     5. Halo qui suit la souris sur les cartes .spot
     On enregistre la position de la souris dans deux variables CSS
     (--mx et --my) que animations.css utilise pour placer le halo.
     --------------------------------------------------------------- */
  if (!reduceMotion) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".spot");
      if (!card) return;
      var box = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - box.left + "px");
      card.style.setProperty("--my", e.clientY - box.top + "px");
    }, { passive: true });
  }
})();
