---
title: "TranslatePsy-AfriSLM testé en wolof et en yoruba : quand un petit modèle
  fait mieux qu'un grand"
lang: fr
date: 2026-10-12
category: africa
summary: Un modèle de traduction de 0,8 milliard de paramètres devance des
  systèmes 30 à 150 fois plus gros sur 19 langues africaines. Nous l'avons testé
  en wolof et en yoruba, avec des locuteurs natifs.
author: Pôle Vulgarisation & Veille
icon: recherche
tags:
  - LLM
  - Traduction automatique
  - Langues africaines
  - Wolof
  - Yoruba
  - Hugging Face
featured: false
math: false
translationKey: translatepsy-afrislm
draft: false
---
Les assistants d'intelligence artificielle maîtrisent l'anglais et le français, mais qu'en est-il des langues africaines comme le yoruba, le haoussa ou le wolof ? Une équipe de recherche a récemment montré qu'un modèle minuscule peut, sur ces langues peu dotées en données, faire mieux que des systèmes bien plus gros. Nous avons voulu le vérifier nous-mêmes.

## Ce que propose le papier

L'équipe Tether AI Research (Milan Gritta, Patrik Lambert, Jihye Back et Amril Nazir) a publié sur arXiv **TranslatePsy-AfriSLM**, un ensemble de ressources ouvertes de traduction automatique pour **19 langues d'Afrique subsaharienne**, dont le wolof, le yoruba, le haoussa, l'igbo, le swahili et l'amharique. Le projet comprend des données parallèles filtrées, des données synthétiques et trois petits modèles (0,8, 2 et 4 milliards de paramètres), tous disponibles sur Hugging Face.

Le résultat qui attire l'attention : le plus petit modèle, avec 0,8 milliard de paramètres, devance sur les trois benchmarks testés (Flores-200, BOUQuET et Smol) des modèles bien plus gros, dont **TranslateGemma-27B** et **Qwen3.5-122B-A10B**, selon le score SSA-COMET, une métrique conçue pour évaluer les langues africaines.

![Graphique : score SSA-COMET en fonction de la taille du modèle. Les trois modèles TranslatePsy-AfriSLM (0,8B, 2B et 4B) sont en haut à gauche, au-dessus de modèles bien plus gros comme TranslateGemma-27B et Qwen3.5-122B.](https://arxiv.org/html/2608.18655v2/figures/size_vs_performance_bouquet.png)
*Fig. 1. Qualité de traduction (SSA-COMET, benchmark BOUQuET) selon la taille du modèle : les modèles TranslatePsy-AfriSLM (points verts) devancent des modèles jusqu'à 150 fois plus gros. Source : Gritta et al. (2026), Figure 1, licence CC BY 4.0.*

### La qualité des données avant la taille

Comment un modèle aussi petit fait-il mieux ? Les auteurs l'attribuent au **tri des données d'entraînement**. Chaque paire de phrases (une phrase et sa traduction) reçoit une note de qualité calculée par trois outils d'évaluation automatique, et seules les meilleures sont gardées.

L'effet est spectaculaire : entraîné sur toutes les données ouvertes brutes (près de 45 milliards de tokens), un modèle obtient le même score qu'avec seulement 1,76 milliard de tokens bien choisis. Le filtrage écarte ainsi **jusqu'à 96 % des données sans perte de qualité**.

![Graphique : score SSA-COMET en fonction du nombre de tokens d'entraînement. Le modèle entraîné sur les données brutes, en bas à droite, utilise près de 45 milliards de tokens pour un score plus faible que de nombreuses configurations filtrées bien plus économes.](https://arxiv.org/html/2608.18655v2/figures/pareto_frontier_ssa_vs_tokens__bouquet.png)
*Fig. 2. Chaque forme est un modèle entraîné sur un mélange de données différent. Le modèle « Open-source (Unfiltered) », en bas à droite, utilise le plus de données pour l'un des scores les plus faibles. Source : Gritta et al. (2026), Figure 4, licence CC BY 4.0.*

## Notre test

- **Modèle :** [qvac/TranslatePsy-AfriSLM-0.8B](https://huggingface.co/qvac/TranslatePsy-AfriSLM-0.8B), le plus petit des trois.
- **Langues :** wolof et yoruba.
- **Directions :** anglais ↔ wolof et anglais ↔ yoruba, dans les deux sens.
- **Phrases :** 15 phrases de la vie courante.
- **Évaluation :** chaque traduction a été relue par un locuteur du wolof ou du yoruba, qui a jugé sa qualité et sa fidélité au sens d'origine.

Nous n'avons pas réussi à faire tourner le modèle sur nos ordinateurs : le test a été réalisé sur Google Colab.

## Résultats

Sur 15 phrases, **14 ont été jugées bonnes** par nos relecteurs natifs, et une seule moyenne.


| Direction | Phrases | Bonne | Moyenne |
| ---------------- | ------- | ----- | ------- |
| Wolof → anglais | 5 | 4 | 1 |
| Anglais → wolof | 3 | 3 | 0 |
| Anglais → yoruba | 5 | 5 | 0 |
| Yoruba → anglais | 2 | 2 | 0 |


Quelques exemples représentatifs :


| Phrase de départ | Direction | Traduction obtenue | Avis du relecteur |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Senegal, dëkk bu am téranga la | Wolof → anglais | Senegal is a very teranga city. | Bonne |
| I'm heading to work, I'll be back late | Anglais → wolof | Maa ngi dem liggéey, dinaa dellu lu yàgg. | Bonne |
| Man ngi dem daara | Wolof → anglais | I'm going to bed. | Moyenne : « daara » (l'école coranique) est mal traduit |
| Could you please tell me how I can get to the train station from here? | Anglais → yoruba | Jọ̀wọ́ sọ fún mi bí mo ṣe lè dé ibùdókọ̀ ojú irin láti ibí yìí? | Bonne |
| Mo sábà máa ń tètè jí láàárọ̀, mo sì máa ń mu ife kọfí kí n tó bẹ̀rẹ̀ ọjọ́ mi. | Yoruba → anglais | I usually wake up early in the morning and have a cup of coffee before I start my day | Bonne, avec une petite nuance |


La dernière ligne est un **aller-retour** : la phrase yoruba est la traduction produite par le modèle à partir de « I usually wake up early in the morning and start my day with a cup of coffee ». Le sens revient presque intact. Seule nuance : le café passe *avant* le début de la journée, alors que la phrase d'origine commence la journée *avec* un café.

Le temps de traitement allait de 19 à 60 secondes par phrase sur Colab, avec un cas isolé à 120 secondes.

Ces résultats rejoignent ceux du papier. Sur le benchmark BOUQuET, le fine-tuning fait nettement progresser le wolof comme le yoruba par rapport au modèle de base :

![Quatre graphiques en barres, un par métrique (COMET-22, SSA-COMET, MetricX, chrF++), pour 19 langues africaines, avant (Qwen3.5-2B, en gris) et après fine-tuning (TranslatePsy-AfriSLM-2B, en vert). En SSA-COMET, le score progresse de 0,355 pour le yoruba et de 0,262 pour le wolof.](https://arxiv.org/html/2608.18655v2/figures/africa_iid_bouquet_per_language.png)
*Fig. 3. Scores par langue sur quatre métriques, avant (gris) et après (vert) fine-tuning, pour le modèle 2B. Dans le deuxième graphique (SSA-COMET), le wolof (wol) et le yoruba (yor) passent d'environ 0,3 à plus de 0,6. Source : Gritta et al. (2026), Figure 11, licence CC BY 4.0.*

Le papier montre aussi que le wolof reste une langue difficile : sur MetricX (troisième graphique, où un score bas est meilleur), c'est la langue où le modèle 2B obtient le moins bon score des 19.

## Ce que le test nous a appris

**Le modèle ne part que de l'anglais.** Nous avons aussi essayé de traduire du français vers le wolof et vers le yoruba : le modèle a renvoyé les phrases telles quelles. Ce n'est pas étonnant : il a été entraîné sur des paires anglais ↔ langue africaine, et les auteurs ne testent pas le français comme langue de départ.

**L'orthographe compte.** Le modèle est sensible à l'orthographe, aux accents et aux caractères propres à chaque langue (ë, ñ, ŋ, à, é, ó, ọ, ṣ…). Une phrase écrite dans la graphie standard est bien mieux comprise qu'un texte tapé à la volée. Ce type de test demande donc un bon locuteur, capable d'écrire correctement et de juger la traduction obtenue.

**Quinze phrases ne font pas un benchmark.** Notre test est un premier contact, pas une évaluation complète : il dit si le modèle est utilisable sur des phrases simples, pas comment il se comporte sur des textes longs, techniques ou très idiomatiques.

## Impact pour l'Afrique

Ce qui rend ce travail intéressant pour nous ne tient pas qu'à la performance : c'est la taille. Un modèle de 0,8 milliard de paramètres coûte beaucoup moins cher à faire tourner qu'un modèle de 27 ou 122 milliards, un écart qui compte directement là où la connectivité est limitée et où chaque heure de calcul se négocie. Ce n'est pas encore un modèle qui tourne hors ligne sur un téléphone d'entrée de gamme (nous ne l'avons même pas fait tourner sur un ordinateur), mais c'est une direction : la preuve qu'on peut viser la sobriété sans sacrifier la qualité.

L'autre apport, moins visible mais tout aussi important, est le jeu de données lui-même : 19 langues africaines, avec des ressources ouvertes et documentées. C'est exactement le type de brique sur laquelle un projet comme AfriVoice peut s'appuyer, et un rappel que la qualité des données compte souvent plus que la taille du modèle, un principe qui vaut aussi pour nos propres travaux.

Enfin, l'erreur sur « daara » est un bon rappel : un score de benchmark ne dit pas tout. Seule une relecture par un locuteur natif révèle ce genre de nuance culturelle et linguistique. Les auteurs le reconnaissent eux-mêmes : leur papier se termine sur la nécessité d'une évaluation humaine pour mesurer la qualité réelle des traductions en langues africaines. C'est exactement ce que notre démarche de veille testée cherche à faire : confronter un chiffre impressionnant à l'usage réel plutôt que de le relayer tel quel.

> **À retenir**
>
> Un modèle de 0,8 milliard de paramètres, entraîné sur des données soigneusement triées, traduit mieux le wolof et le yoruba que des modèles 30 à 150 fois plus gros. Notre test confirme qu'il est utilisable sur des phrases courantes, à condition de partir de l'anglais et d'écrire dans la graphie standard.

## Références

1. Gritta, M., Lambert, P., Back, J., & Nazir, A. (2026). *TranslatePsy-AfriSLM: High-Quality Data Scaling For Low-Resource Machine Translation*. Tether AI Research. [arXiv:2608.18655](https://arxiv.org/abs/2608.18655), licence CC BY 4.0.
2. Modèles et données sur Hugging Face : [collection qvac/translatepsy-afrislm](https://huggingface.co/collections/qvac/translatepsy-afrislm)

