/* =====================================================================
   forms.js — l'envoi des formulaires (contact, projet, newsletter)
   ---------------------------------------------------------------------
   Un site statique n'a pas de serveur pour recevoir les messages.
   On utilise donc un service de formulaires (ex. Formspree) : chaque
   formulaire a une adresse d'envoi, notée dans src/_data/settings.json
   (champ « forms »), modifiable depuis l'admin.

   Ce script :
     • envoie le formulaire sans recharger la page ;
     • affiche « Envoi… », puis un message de succès ou d'erreur ;
     • si l'adresse d'envoi n'est pas encore remplie, l'indique poliment.
   Les messages sont dans la langue de la page (fichiers i18n).

   Anti-robots : chaque formulaire contient un champ caché « _gotcha »
   qu'un humain ne voit pas (un robot, lui, le remplit). Avec le script
   Google (apps-script/Code.gs), on envoie aussi « _elapsed », le temps
   passé sur la page : un envoi en moins de 3 secondes est ignoré.
   ===================================================================== */
(function () {
  "use strict";

  var pageLoadedAt = Date.now();

  // Les messages viennent des fichiers de traduction (i18n/en.json, i18n/fr.json) :
  // base.njk les écrit dans les attributs data-form-… de la balise <body>.
  var messages = document.body.dataset;
  var text = {
    sending: messages.formSending || "Sending…",
    success: messages.formSuccess || "Thank you!",
    subscribed: messages.formSubscribed || "Thank you!",
    error: messages.formError || "Something went wrong.",
    notReady: messages.formNotReady || "This form is not connected yet."
  };

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();                      // on reste sur la page

      var status = form.querySelector(".form-status");
      var button = form.querySelector('[type="submit"]');
      var endpoint = form.getAttribute("action");  // l'adresse du service de formulaires

      function show(state, message) {
        if (!status) return;
        status.setAttribute("data-state", state);
        status.textContent = message;
      }

      // Adresse pas encore configurée (champ vide dans settings.json)
      if (!endpoint || endpoint.indexOf("http") !== 0) {
        show("error", text.notReady);
        return;
      }

      button.disabled = true;
      show("", text.sending);

      var data = new FormData(form);
      if (endpoint.indexOf("script.google.com") !== -1) {
        data.append("_elapsed", String(Date.now() - pageLoadedAt));
      }

      fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          // Le script Google répond toujours « 200 » : on lit sa réponse
          // { ok: true/false } pour savoir si le message a été accepté.
          return response.json().catch(function () { return {}; });
        })
        .then(function (result) {
          if (result.ok === false) throw new Error(result.error || "rejected");
          show("success", form.dataset.form === "newsletter" ? text.subscribed : text.success);
          form.reset();
        })
        .catch(function () {
          show("error", text.error);
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
})();
