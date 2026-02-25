---
layout: post
title: "Step 1 — What Is a Satellite Image, Really?"
date: 2026-02-18
series: "ML for Earth Observation"
categories: [earth-observation, remote-sensing, fundamentals]
#description: "Before writing a single line of ML code, you need to understand what you're actually feeding into your model. Bands, projections, radiometry and why a satellite pixel is nothing like a camera pixel."
read_time: 3
skills: [Remote Sensing fundamentals, data exploration]
# github: https://github.com/berkesenturk/eo-ml-30days/blob/main/day01_what_is_a_satellite_image.ipynb
# runtime: 5 minutes (no GPU needed)
data_source: EUMETSAT SEVIRI sample scene (free registration)
next_post: "Step 2 — Getting Data: EUMETSAT, Copernicus & DWD"
next_post_url: /blog/2026/02/19/eo-ml-day-02-getting-data/
image: /assets/logo.png
---


## A satellite image is not a photograph

<figure>
  <img src="/assets/sat_data.png" class="small">
</figure>

Your phone camera captures three channels (red, green, blue) as perceived by a sensor designed to mimic the human eye. A satellite instrument like SEVIRI (the Spinning Enhanced Visible and InfraRed Imager aboard Meteosat) captures **12 spectral channels**, most of which are completely invisible to human eyes.

Those channels include:

- Visible light (what we'd recognise as a photo)
- Near-infrared (NIR) — sensitive to vegetation health
- Mid-wave infrared (MWIR) — sensitive to fire hotspots and surface temperature
- Thermal infrared (TIR) — what the atmosphere itself emits at night
- Water vapour channels — literally imaging moisture in the mid-troposphere

When you load all 12 channels into a NumPy array and normalise them together, you're treating a water vapour image and a visible image as the same kind of thing. They're not. They have different physical units, different dynamic ranges, different noise characteristics, and different relationships to what you're trying to detect.



<div class="callout">
<strong>The first lesson: know your data before you touch your model.</strong>
</div>

## Dataset: High Rate SEVIRI Level 1.5 Image Data - MSG - 0 degree


> *"The Spinning Enhanced Visible and InfraRed Imager (SEVIRI) is MSG's primary instrument and has the capacity to observe the Earth in 12 spectral channels. Eight of the channels are in the thermal infrared, providing, among other information, permanent data about the temperatures of clouds, land and sea surfaces. One of the channels is called the High Resolution Visible (HRV) channel, and has a sampling distance at nadir of 1km, as opposed to the 3km resolution of the other visible channels.*
>
> *Using channels that absorb ozone, water vapour and carbon dioxide, MSG satellites allows meteorologists to analyse the characteristics of atmospheric air masses and reconstruct a three-dimensional view of the atmosphere. The 1km horizontal image resolution for the visible light spectral channel also helps weather forecasters in detecting and predicting the onset or end of severe weather."*
>
> — EUMETSAT

## The projection problem

<figure>
  <img src="/assets/05-geostationary-sat-ani.webp" class="small center">
  <figcaption>https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/</figcaption>
</figure>

Satellite pixels aren't on a regular lat/lon grid. SEVIRI uses geostationary projection the satellite sits fixed above the equator at 35,786 km altitude, constantly viewing the same hemisphere. Pixels near the edge of Earth's visible disk are massively stretched compared to pixels directly below the satellite. A nominal 3km pixel over Germany might span 6-8km on the ground near northern Scandinavia due to this viewing angle.This matters because comparing satellite data with ground stations or combining multiple satellite sources requires reprojecting everything to a common coordinate system first. You can't just overlay arrays and assume pixels align they won't.

## What this means for ML

Three practical consequences that will affect every model you build:
1. Spatial autocorrelation breaks random splits. A fog bank doesn't affect a single pixel it spans thousands of adjacent pixels. Random train/test splitting means your validation set contains pixels almost identical to training pixels just 3km away. Your metrics will look great, but your model hasn't learned to generalize. You need spatial or temporal splits instead.
2. Channel statistics have physical meaning. A thermal infrared channel measuring brightness temperature ranges from 210K (cold cloud tops) to 310K (warm surfaces). A visible reflectance channel goes from 0 to 1.2. Normalizing these together destroys their physical interpretation and creates pathological gradients. Each channel needs separate standardization using climatological statistics, not batch statistics.
3. Missing data is structured, not random. Clouds block the view of fog beneath them. Scan line failures create systematic gaps. Sun glint contaminates ocean pixels. These aren't random missing values you can drop or impute they have spatial and temporal patterns your model must handle explicitly, either through masking or by learning to recognize unreliable pixels.


---

## Tomorrow

In Day 2 we actually get our hands on data engineering: I'll walk through the design choices of the ETL pipeline.
