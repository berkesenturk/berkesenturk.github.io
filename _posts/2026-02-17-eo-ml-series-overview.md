---
layout: post
title: "ML for Earth Observation — Series Overview"
date: 2026-02-17
series: "ML for Earth Observation"
categories: [earth-observation, data-engineering, machine-learning, journaling]
description: "An engineering journal building production level ML systems on satellite data, from raw netCDF files to deployed cloud hole detectors. Full roadmap inside."
read_time: 5
skills: ["data engineering project planning"]
next_post: "Step 1 — What Is a Satellite Image, Really?"
next_post_url: /blog/2026/02/18/eo-ml-day-01-what-is-a-satellite-image/
image: /assets/logo.png
---

Most data science blog series teach machine learning on Titanic survivors or iris flowers. This one does it on **real pixels from space**.

Over the next 30 days I'm publishing a daily engineering journal documenting how I build MLOps pipelines using satellite data. Every post has a working notebook, a real dataset, and at least one honest paragraph about what went wrong.

This is not a tutorial series. It's a working engineer's notebook made public.

---

## Project Idea


I decided to start from the beginning to the deep learning project that I worked before at my work student job at Institute of Meteorology and Climate Research while I was studying my Master’s Degree at KIT. The topic of the project was Cloud Hole Detection with Convolutional Neural Networks. The task was to accomplish the binary classification with CNNs My task was to create labels from the preprocessed (subsetted) data as 0 (not_cloud_hole) and 1 (cloud_hole), write the scripts for models, datasets and evaluate them.

This project was presented in Helmholtz AI 2025 in Karlsruhe but I will start from beginning and explore it furthermore to see if any step of the project could have been better. 


---

## The full roadmap

### Stage 1: The Data
Before any model, you need to understand what you're working with. Most DS courses skip this entirely. We won't. Yet, I will skip beginner level information such as bands, projections and so on. 

| Step | Topic |
|-----|-------|
| 1 | Data: Meteosat SEVIRI - Overview  |
| 2 | Data Retrieval Strategy: ETL Pipeline Design |
| 3 | ETL Pipeline #1: API Poller, messaging service |
| 4 | ETL Pipeline #2: Downloader Service |
| 5 | ETL Pipeline #3: Processor Service (transforming data) |
| 6 | ETL Pipeline #4:  |
| 7 | Stage 1 recap: the data pipeline we built, what surprised me |

### Stage 2 — Will come soon!


---

## How to follow along

Every post will be published here. The companion GitHub repositories, for Data Engineering aspects `https://github.com/berkesenturk/SatelliteETL` and `https://github.com/berkesenturk/Cloud_hole_detection_CNN` to cover Data Science behind of the project will have contents and notebook as frequent as possible. I'll update it as each post goes live.

If you work in EO, climate tech, or geospatial ML and want to discuss or suggestions for any of this, please find me on [LinkedIn](https://www.linkedin.com/in/berkesenturk/) or [GitHub](https://github.com/berkesenturk).

Let's get into the data.
