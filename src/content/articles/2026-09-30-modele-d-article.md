---
# Chaque ligne ci-dessous est un réglage de l'article.
# Ce qui suit un « # » est un commentaire : il n'apparaît pas sur le site.
title: "Modèle d'article : images et formules"   # Titre affiché en haut de l'article
lang: fr                   # Langue de l'article : fr ou en
date: 2026-09-30           # Date de publication (année-mois-jour)
category: tuto             # tuto · field (retour d'expérience) · africa (Data & Afrique) · community
summary: "Un article d'exemple qui montre comment insérer une image avec sa légende, des formules mathématiques et du code."   # 2 phrases maximum, affichées sur la carte
author: Équipe DAH Labs    # Votre nom (si vide : « Équipe DAH Labs »)
icon: innovation           # innovation · recherche · collaboration · donnees · impact · communaute
tags: [Modèle, Markdown, Formules]   # Mots-clés, utilisés par la recherche du blog
cover: ""                  # Image de couverture (facultatif), ex. "/media/articles/ma-couverture.jpg"
featured: false            # true = affiché « À la une » sur l'accueil et le blog
math: true                 # OBLIGATOIRE à true dès que l'article contient un bloc math
translationKey: ""         # Même mot dans la version FR et EN d'un article traduit (sinon vide)
draft: true                # true = brouillon, invisible en ligne · false = publié
---
> **Ceci est un modèle d'article.** Ouvrez le fichier `src/content/articles/2026-09-30-modele-d-article.md` dans VS Code à côté de cette page : vous verrez ce qui est écrit, et ce que cela donne. Il est en brouillon : il s'affiche sur votre ordinateur, mais jamais sur le site en ligne.

Pour écrire un nouvel article, le plus simple est de copier ce fichier, de le renommer (`année-mois-jour-titre-court.md`), puis de remplacer son contenu.

## Mettre en forme le texte

Un paragraphe s'écrit normalement. Pour commencer un nouveau paragraphe, on laisse une ligne vide.

On peut mettre des mots en **gras**, en *italique*, écrire du `code` dans une phrase ou ajouter un [lien vers un site](https://dataafriquehub.org/).

### Les listes

- Une liste à puces commence par un tiret.
- Chaque élément est sur sa propre ligne.

1. Une liste numérotée commence par « 1. ».
2. Puis « 2. », et ainsi de suite.

### Les encadrés

> **À retenir**
>
> Un encadré s'obtient avec des lignes qui commencent par « > ». La première ligne, en gras, lui sert de titre.

Les titres qui commencent par `##` et `###` forment automatiquement le sommaire, en haut de l'article.

## Insérer une image

Trois étapes :

1. **Déposez le fichier** dans le dossier `src/media/articles/` : format SVG, PNG ou JPG, de préférence moins de 500 Ko, avec un nom sans espaces ni accents.
2. **Insérez-le dans le texte** avec la syntaxe ci-dessous. Entre crochets : une description de l'image, lue par les lecteurs d'écran. Entre parenthèses : son adresse, qui commence par `/media/articles/`.
3. **Ajoutez une légende** : une ligne en italique juste sous l'image, sans ligne vide entre les deux.

````markdown
![Schéma en trois étapes : les données sont collectées, analysées, puis servent à décider.](/media/articles/modele-schema.svg)
*Fig. 1. Le chemin de la donnée à la décision.*
````

Voici le résultat :

![Schéma en trois étapes : les données sont collectées, analysées, puis servent à décider.](/media/articles/modele-schema.svg)
*Fig. 1. Le chemin de la donnée à la décision.*

## Écrire une formule mathématique

Deux conditions :

1. Dans les réglages en haut du fichier : `math: true`.
2. La formule est écrite en LaTeX, dans un bloc `math`, comme ceci :

````markdown
```math
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
```
````

Ce qui donne :

```math
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
```

*La moyenne de n valeurs x₁, x₂, …, xₙ.*

Une formule peut être plus riche, par exemple l'écart-type :

```math
\sigma = \sqrt{\frac{1}{n} \sum_{i=1}^{n} \left( x_i - \bar{x} \right)^2}
```

*L'écart-type mesure la dispersion des valeurs autour de la moyenne.*

### Aide-mémoire LaTeX

| Pour obtenir | Écrivez |
|---|---|
| une fraction | `\frac{a}{b}` |
| un indice, un exposant | `x_i`, `x^2` (ou `x^{10}` pour plusieurs caractères) |
| une racine carrée | `\sqrt{x}` |
| une somme de i = 1 à n | `\sum_{i=1}^{n}` |
| une barre, un chapeau | `\bar{x}`, `\hat{y}` |
| des lettres grecques | `\alpha`, `\beta`, `\mu`, `\sigma` |
| des parenthèses qui s'adaptent | `\left( … \right)` |
| du texte normal | `\text{moyenne}` |

> **Bon à savoir**
>
> Une formule doit être dans son propre bloc : une formule au milieu d'une phrase, comme `$x^2$`, ne sera pas mise en forme. Pour vérifier une formule avant de la coller, testez-la sur [katex.org](https://katex.org).

## Ajouter du code

Un bloc de code commence, comme les formules, par trois accents graves, suivis du nom du langage (`python`, `sql`, `r`, `bash`…). Le code est coloré automatiquement et un bouton « Copier » apparaît.

```python
import pandas as pd

notes = pd.Series([12, 15, 9, 17, 14])
print("Moyenne :", notes.mean())                    # Moyenne : 13.4
print("Écart-type :", round(notes.std(ddof=0), 2))  # Écart-type : 2.73
# ddof=0 : on divise par n, comme dans la formule de l'écart-type ci-dessus
```

## Publier l'article

Avant de publier :

- remplacez le titre, le résumé, les mots-clés et le texte ;
- supprimez l'encadré « Ceci est un modèle d'article » tout en haut ;
- mettez `math: false` si l'article ne contient aucune formule ;
- passez `draft: true` à `draft: false`, puis envoyez la modification (dans VS Code : Source Control, puis Commit, puis Sync Changes).

## Références

1. KaTeX. *Liste des fonctions LaTeX prises en charge*. [katex.org/docs/supported.html](https://katex.org/docs/supported.html)
2. *Markdown Guide : Basic Syntax*. [markdownguide.org/basic-syntax](https://www.markdownguide.org/basic-syntax/)
