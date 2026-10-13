---
title: "TranslatePsy-AfriSLM tested in Wolof and Yoruba: when a small model
  beats a big one"
lang: en
date: 2026-10-12
category: africa
summary: A 0.8-billion-parameter translation model outperforms systems 30 to 150
  times larger across 19 African languages. We tested it in Wolof and Yoruba,
  with native speakers.
author: Outreach & Tech Watch team
icon: recherche
tags:
  - LLM
  - Machine translation
  - African languages
  - Wolof
  - Yoruba
  - Hugging Face
featured: false
math: false
translationKey: translatepsy-afrislm
draft: false
---
AI assistants handle English and French well, but what about African languages such as Yoruba, Hausa or Wolof? A research team recently showed that a tiny model can outperform much larger systems on these low-resource languages. We wanted to check for ourselves.

## What the paper proposes

The Tether AI Research team (Milan Gritta, Patrik Lambert, Jihye Back and Amril Nazir) published **TranslatePsy-AfriSLM** on arXiv: a set of open machine translation resources for **19 Sub-Saharan African languages**, including Wolof, Yoruba, Hausa, Igbo, Swahili and Amharic. The project includes filtered parallel data, synthetic data and three small models (0.8, 2 and 4 billion parameters), all available on Hugging Face.

The headline result: the smallest model, with 0.8 billion parameters, beats much larger models on all three benchmarks tested (Flores-200, BOUQuET and Smol), including **TranslateGemma-27B** and **Qwen3.5-122B-A10B**, according to SSA-COMET, a metric designed to evaluate African languages.

![Chart: SSA-COMET score by model size. The three TranslatePsy-AfriSLM models (0.8B, 2B and 4B) sit in the top left, above much larger models such as TranslateGemma-27B and Qwen3.5-122B.](https://arxiv.org/html/2608.18655v2/figures/size_vs_performance_bouquet.png)
*Fig. 1. Translation quality (SSA-COMET, BOUQuET benchmark) by model size: the TranslatePsy-AfriSLM models (green dots) outperform models up to 150 times larger. Source: Gritta et al. (2026), Figure 1, CC BY 4.0 licence.*

### Data quality before model size

How does such a small model do better? The authors credit **the filtering of the training data**. Each sentence pair (a sentence and its translation) gets a quality score computed by three automatic evaluation tools, and only the best pairs are kept.

The effect is striking: trained on all the raw open data (nearly 45 billion tokens), a model reaches the same score as one trained on just 1.76 billion well-chosen tokens. Filtering therefore removes **up to 96% of the data with no loss in quality**.

![Chart: SSA-COMET score by number of training tokens. The model trained on raw data, in the bottom right, uses nearly 45 billion tokens for a lower score than many far leaner filtered configurations.](https://arxiv.org/html/2608.18655v2/figures/pareto_frontier_ssa_vs_tokens__bouquet.png)
*Fig. 2. Each shape is a model trained on a different data mix. The "Open-source (Unfiltered)" model, in the bottom right, uses the most data for one of the lowest scores. Source: Gritta et al. (2026), Figure 4, CC BY 4.0 licence.*

## Our test

- **Model:** [qvac/TranslatePsy-AfriSLM-0.8B](https://huggingface.co/qvac/TranslatePsy-AfriSLM-0.8B), the smallest of the three.
- **Languages:** Wolof and Yoruba.
- **Directions:** English ↔ Wolof and English ↔ Yoruba, both ways.
- **Sentences:** 15 everyday sentences.
- **Evaluation:** each translation was reviewed by a Wolof or Yoruba speaker, who judged its quality and faithfulness to the original meaning.

We could not get the model running on our own computers: the test was run on Google Colab.

## Results

Out of 15 sentences, **14 were rated good** by our native reviewers, and only one average.


| Direction | Sentences | Good | Average |
| ---------------- | --------- | ---- | ------- |
| Wolof → English | 5 | 4 | 1 |
| English → Wolof | 3 | 3 | 0 |
| English → Yoruba | 5 | 5 | 0 |
| Yoruba → English | 2 | 2 | 0 |


A few representative examples:


| Source sentence | Direction | Translation | Reviewer's verdict |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Senegal, dëkk bu am téranga la | Wolof → English | Senegal is a very teranga city. | Good |
| I'm heading to work, I'll be back late | English → Wolof | Maa ngi dem liggéey, dinaa dellu lu yàgg. | Good |
| Man ngi dem daara | Wolof → English | I'm going to bed. | Average: "daara" (Quranic school) is mistranslated |
| Could you please tell me how I can get to the train station from here? | English → Yoruba | Jọ̀wọ́ sọ fún mi bí mo ṣe lè dé ibùdókọ̀ ojú irin láti ibí yìí? | Good |
| Mo sábà máa ń tètè jí láàárọ̀, mo sì máa ń mu ife kọfí kí n tó bẹ̀rẹ̀ ọjọ́ mi. | Yoruba → English | I usually wake up early in the morning and have a cup of coffee before I start my day | Good, with a slight nuance |


The last row is a **round trip**: the Yoruba sentence is the model's own translation of "I usually wake up early in the morning and start my day with a cup of coffee". The meaning comes back almost intact. The only nuance: the coffee now comes *before* the day starts, whereas the original sentence starts the day *with* a coffee.

Processing time ranged from 19 to 60 seconds per sentence on Colab, with one outlier at 120 seconds.

These results are in line with the paper. On the BOUQuET benchmark, fine-tuning clearly improves both Wolof and Yoruba compared with the base model:

![Four bar charts, one per metric (COMET-22, SSA-COMET, MetricX, chrF++), for 19 African languages, before (Qwen3.5-2B, grey) and after fine-tuning (TranslatePsy-AfriSLM-2B, green). On SSA-COMET, the score rises by 0.355 for Yoruba and 0.262 for Wolof.](https://arxiv.org/html/2608.18655v2/figures/africa_iid_bouquet_per_language.png)
*Fig. 3. Per-language scores on four metrics, before (grey) and after (green) fine-tuning, for the 2B model. In the second chart (SSA-COMET), Wolof (wol) and Yoruba (yor) go from about 0.3 to over 0.6. Source: Gritta et al. (2026), Figure 11, CC BY 4.0 licence.*

The paper also shows that Wolof remains a hard language: on MetricX (third chart, where lower is better), it is the language where the 2B model scores worst of all 19.

## What the test taught us

**The model only works from English.** We also tried translating from French into Wolof and Yoruba: the model returned the sentences unchanged. This is not surprising: it was trained on English ↔ African language pairs, and the authors do not test French as a source language.

**Spelling matters.** The model is sensitive to spelling, accents and the characters specific to each language (ë, ñ, ŋ, à, é, ó, ọ, ṣ…). A sentence written in the standard orthography is understood far better than text typed on the fly. This kind of test therefore needs a skilled speaker, able to write correctly and to judge the result.

**Fifteen sentences are not a benchmark.** Our test is a first look, not a full evaluation: it tells us whether the model is usable on simple sentences, not how it handles long, technical or highly idiomatic text.

## Why it matters for Africa

What makes this work interesting to us is not only performance: it is size. A 0.8-billion-parameter model costs far less to run than a 27- or 122-billion-parameter one, a gap that matters directly where connectivity is limited and every hour of compute is negotiated. It is not yet a model that runs offline on an entry-level phone (we did not even get it running on a laptop), but it points the way: proof that you can aim for frugality without sacrificing quality.

The other contribution, less visible but just as important, is the dataset itself: 19 African languages, with open and documented resources. This is exactly the kind of building block a project like AfriVoice can build on, and a reminder that data quality often matters more than model size, a principle that applies to our own work too.

Finally, the "daara" error is a useful reminder that a benchmark score does not tell the whole story. Only a review by a native speaker reveals this kind of cultural and linguistic nuance. The authors acknowledge this themselves: their paper closes on the need for human evaluation to measure the real quality of translations into African languages. That is exactly what our hands-on tech watch aims to do: test an impressive number against real use rather than simply passing it on.

> **Key takeaway**
>
> A 0.8-billion-parameter model, trained on carefully filtered data, translates Wolof and Yoruba better than models 30 to 150 times larger. Our test confirms it is usable on everyday sentences, as long as you start from English and write in the standard orthography.

## References

1. Gritta, M., Lambert, P., Back, J., & Nazir, A. (2026). *TranslatePsy-AfriSLM: High-Quality Data Scaling For Low-Resource Machine Translation*. Tether AI Research. [arXiv:2608.18655](https://arxiv.org/abs/2608.18655), CC BY 4.0 licence.
2. Models and data on Hugging Face: [qvac/translatepsy-afrislm collection](https://huggingface.co/collections/qvac/translatepsy-afrislm)

