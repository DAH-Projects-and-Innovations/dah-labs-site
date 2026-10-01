# Guide : publier sur le site DAH Labs

Ce guide est pour **toute personne qui publie du contenu** : aucune connaissance en code n'est nécessaire.
Tout se fait dans l'**admin** : **[app.pagescms.org](https://app.pagescms.org)**.

---

## Se connecter

1. Vous recevez une **invitation par email** de la part de l'équipe technique.
2. Cliquez sur le lien, puis ouvrez le dépôt **dah-labs-site**.
3. À gauche, cinq rubriques : **Articles du blog**, **Projets**, **Activités (webinaires)**, **Membres de l'équipe**, **Réglages du site**.

> Après chaque enregistrement, le site se met à jour tout seul en **1 à 2 minutes**. Rechargez la page du site pour voir le changement.

---

## Écrire un article

1. **Articles du blog** → bouton pour ajouter une nouvelle entrée.
2. Remplissez les champs :

| Champ | Conseil |
|---|---|
| **Titre** | Clair et précis. Il crée aussi l'adresse de l'article. |
| **Langue de l'article** | Français ou English. |
| **Date de publication** | Aujourd'hui par défaut. |
| **Catégorie** | Tutoriel · Retour d'expérience · Data & Afrique · Vie de la communauté. |
| **Résumé** | 2 phrases maximum : c'est ce qui s'affiche sur la carte de l'article. |
| **Auteur ou autrice** | Votre nom. Vide = « Équipe DAH Labs ». |
| **Icône officielle DAH** | L'icône affichée sur la carte. |
| **Mots-clés** | Ex. Python, LLM, Power BI (aident la recherche du blog). |
| **Image de couverture** | Facultative. |
| **À la une** | Coché = l'article s'affiche en grand sur l'accueil et le blog. |
| **Formules mathématiques** | À cocher seulement si vous utilisez un bloc `math` (voir plus bas). |
| **Clé de traduction** | Seulement si l'article existe en FR **et** en EN : même mot dans les deux (ex. `rag-langchain`). |
| **Brouillon** | Coché par défaut : l'article n'est **pas visible** sur le site. |
| **Texte de l'article** | Le contenu (voir la mise en forme ci-dessous). |

3. Cliquez sur **Save** (enregistrer). L'article est enregistré comme **brouillon**.
4. Quand il a été relu : décochez **Brouillon** et enregistrez → il est en ligne.

### Mise en forme du texte

L'éditeur a une barre d'outils (gras, titres, listes, liens, images…). On peut aussi basculer en mode **Markdown** pour écrire directement :

| Pour obtenir… | Écrivez… |
|---|---|
| Un titre de section (il apparaît dans le **sommaire**) | `## Mon titre` |
| Un sous-titre | `### Mon sous-titre` |
| **Gras** / *italique* | `**gras**` / `*italique*` |
| Une liste | `- élément` (ou `1. élément` pour une liste numérotée) |
| Un lien | `[texte du lien](https://adresse.com)` |
| Une image | Bouton « image » de la barre d'outils |
| Un encadré « À retenir » | `> **À retenir**` puis, sur la ligne suivante, `> votre texte` |
| Du `code` dans une phrase | `` `print()` `` |

**Un bloc de code** (coloré automatiquement, avec un bouton « Copier ») :

````
```python
import pandas as pd
df = pd.read_csv("donnees.csv")
```
````

Remplacez `python` par le langage utilisé : `sql`, `r`, `bash`, `javascript`…

**Une formule mathématique** (et cochez « Contient des formules mathématiques ») :

````
```math
\text{sim}(q, d) = \frac{q \cdot d}{\lVert q \rVert \, \lVert d \rVert}
```
````

**Une légende sous une image** : écrivez une ligne en *italique* juste sous l'image.

**Les références** : terminez par une section `## Références` avec une liste numérotée.

---

## Ajouter ou modifier un projet

**Projets** → bouton pour ajouter une nouvelle entrée.

- **Nom du projet**, **Statut** (En cours · Déployé · Ouvert aux contributions).
- **Description** en français (obligatoire) et en anglais (facultatif : sinon le français s'affiche).
- **Visibilité** : **Public**, un clic sur la carte ouvre le projet ; **Privé**, le projet est présenté avec un cadenas, sans aucun lien.
- **Lien du dépôt GitHub** et **Lien de la version en ligne** (projets publics) : un clic sur la carte ouvre la version en ligne, sinon le GitHub.
- **Ordre d'affichage** : 1 = en premier. Les **2 premiers** apparaissent sur la page d'accueil.

## Annoncer une activité (webinaire, atelier, rencontre)

**Activités (webinaires)** → bouton pour ajouter une nouvelle entrée.

| Champ | Conseil |
|---|---|
| **Titre** | Le sujet de la session. |
| **Type d'activité** | Webinaire · Atelier · Rencontre. |
| **Date** | Le jour de l'activité. |
| **Horaire** | Début et fin, avec le fuseau horaire : `15:00–16:30 GMT+1`. |
| **Langue de l'activité** | Français ou English. |
| **Intervenants** | Un nom par ligne, avec le rôle si besoin. |
| **Description** | En français (obligatoire) et en anglais (facultatif : sinon le français s'affiche). |
| **Lien d'inscription ou de connexion** | Formulaire d'inscription, lien Zoom, Google Meet, YouTube Live… |
| **Lien du replay** | À ajouter après l'activité : l'adresse de la vidéo (YouTube…). |

- Jusqu'à sa date (incluse), l'activité s'affiche dans **À venir**, avec un bouton **S'inscrire**.
- Le lendemain, elle passe **toute seule** dans **Déjà passées** : le site est remis à jour chaque nuit. Pensez alors à ajouter le **lien du replay**.
- Deux activités d'exemple, en brouillon, montrent le résultat : inspirez-vous-en, puis supprimez-les.

## Ajouter un membre de l'équipe

**Membres de l'équipe** → bouton pour ajouter une nouvelle entrée : nom, rôle (FR et EN), une phrase de présentation, une photo carrée, liens LinkedIn et GitHub, ordre d'affichage.
Des fiches « [Nom complet] » existent déjà en brouillon : il suffit de les ouvrir, de les remplir et de décocher **Brouillon**.

## Réglages du site

**Réglages du site** regroupe ce qui apparaît sur plusieurs pages :
liens des réseaux sociaux (LinkedIn, WhatsApp, X, GitHub), email de contact, lieu, liens DAH Academy et DAH Média, chiffres clés de la page « À propos », adresses des formulaires.
Le lieu n'apparaît sur le site que si son champ est rempli.

---

## Bonnes pratiques

- **Images** : utilisez des images légères (moins de 500 Ko ; format JPG ou WebP pour les photos). Donnez-leur un nom clair (`atelier-langchain.jpg`).
- **Relecture** : laissez « Brouillon » coché tant qu'une autre personne n'a pas relu.
- **Supprimer** un contenu est définitif : préférez recocher « Brouillon » pour le retirer du site.
- Un problème ? L'article n'apparaît pas au bout de 5 minutes ? Prévenez l'équipe technique.
