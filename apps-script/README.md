# Recevoir les formulaires dans une Google Sheet

Ce dossier contient le script [Code.gs](Code.gs). Il reçoit les 3 formulaires du site (contact, « Proposer un projet », newsletter) et range chaque message dans une **Google Sheet**. Pour les messages de contact et les projets proposés, il envoie aussi un **email d'alerte**.

C'est gratuit, sans limite pratique de messages, et les données restent dans le Google Drive de Data Afrique Hub.

```
 Visiteur du site            Google Apps Script                Google Sheet
┌──────────────┐  envoie   ┌──────────────────────┐  écrit   ┌─────────────────────┐
│ formulaire   │ ────────▶ │ vérifie (anti-robots,│ ───────▶ │ onglets : Contact,  │
│ (forms.js)   │           │ email valide, limite)│          │ Projets proposés,   │
└──────────────┘           └──────────┬───────────┘          │ Newsletter          │
                                      │ alerte               └─────────────────────┘
                                      ▼
                           dataafriquehub@gmail.com
```

Ce dossier n'est **pas** publié avec le site : le script vit chez Google. Il est rangé ici pour garder sa version de référence avec le reste du code.

---

## Installation (une seule fois, environ 10 minutes)

À faire avec le compte Google qui doit recevoir les messages (ex. `dataafriquehub@gmail.com`).

### 1. Créer la feuille
1. Sur [sheets.google.com](https://sheets.google.com), créer une feuille vide, nommée par exemple **« Formulaires du site DAH Labs »**.
2. Pas besoin de créer les onglets : le script crée **Contact**, **Projets proposés** et **Newsletter** au premier message.

### 2. Coller le script
1. Dans la feuille : **Extensions → Apps Script**.
2. Effacer le contenu du fichier `Code.gs` proposé, puis y coller **tout** le contenu de [Code.gs](Code.gs).
3. En haut du fichier, vérifier `NOTIFY_EMAIL`, l'adresse qui reçoit les alertes.
4. Enregistrer (icône 💾).

### 3. Autoriser et tester
1. Dans la liste des fonctions (en haut), choisir **`testerLeFormulaire`**, puis cliquer sur **Exécuter**.
2. Google demande des autorisations : **Examiner les autorisations** → choisir le compte → **Paramètres avancés** → **Accéder au projet (non sécurisé)** → **Autoriser**.
   Cet avertissement est normal : le script est le vôtre et n'a pas été vérifié par Google.
3. Vérifier qu'une ligne « Test » est apparue dans l'onglet **Contact** et qu'un email d'alerte est arrivé. La ligne peut ensuite être supprimée.

### 4. Publier comme application Web
1. **Déployer → Nouveau déploiement**, puis l'icône ⚙️ → **Application Web**.
2. Régler :
   - **Description** : `Formulaires du site`
   - **Exécuter en tant que** : **Moi**
   - **Qui peut accéder** : **Tout le monde**
3. **Déployer**, puis copier l'**URL de l'application Web**. Elle ressemble à `https://script.google.com/macros/s/AKfy…/exec`.
4. Contrôle : ouvrir cette URL dans le navigateur. Le message « DAH Labs : réception des formulaires active. » doit s'afficher.

« Tout le monde » veut dire que **n'importe qui peut envoyer** un formulaire (c'est le but). Personne ne peut **lire** la feuille : elle reste privée.

### 5. Brancher le site
Dans l'admin (Pages CMS) : **Réglages du site → Adresses d'envoi des formulaires**. Coller **la même URL** dans les 3 champs (contact, proposer un projet, newsletter), puis enregistrer.
Le script reconnaît chaque formulaire grâce à son champ caché `_form`.

Une à deux minutes plus tard, le site est reconstruit : envoyer un vrai message depuis la page Contact pour vérifier.

---

## Modifier le script plus tard

Après chaque modification de `Code.gs` dans l'éditeur Google, il faut **republier**, sinon l'ancienne version continue de tourner :
**Déployer → Gérer les déploiements → ✏️ (modifier) → Version : Nouvelle version → Déployer**.
De cette façon, l'URL ne change pas et le site n'a rien à modifier.

Pensez aussi à recopier la nouvelle version dans `apps-script/Code.gs` de ce dépôt.

## Protection contre les robots

| Protection | Comment |
|---|---|
| Champ piège `_gotcha` | Invisible pour un humain. S'il est rempli, l'envoi est ignoré sans rien écrire. |
| Temps minimum | `forms.js` envoie le temps passé sur la page. Moins de 3 secondes (ou pas de JavaScript, comme la plupart des robots) : envoi ignoré. |
| Limites par heure | 5 envois par adresse email, 60 au total (modifiable dans `CONFIG`). |
| Contrôles | Adresse email valide, champs obligatoires remplis, textes coupés à 5 000 caractères, protection contre les « formules » piégées dans la feuille. |

## Limites à connaître

- **Emails d'alerte** : un compte Gmail gratuit peut envoyer 100 emails par jour avec Apps Script. Au-delà, les messages sont toujours enregistrés dans la feuille, seule l'alerte manque.
- **Newsletter** : le script **collecte** les adresses mais n'envoie pas la newsletter. Pour l'envoi, exporter l'onglet **Newsletter** (Fichier → Télécharger → CSV) et l'importer dans un outil d'emailing comme Brevo ou MailerLite, qui gère aussi les désinscriptions.
- **Données personnelles** : la feuille contient des noms et des emails. La partager seulement avec les personnes qui en ont besoin, et supprimer une adresse si quelqu'un demande à se désinscrire.
