---
layout: post
title: "Step 2 — Getting Data: EUMETSAT"
date: 2026-02-19
series: "ML for Earth Observation"
categories: [earth-observation, data-engineering, python]
description: "Where to get real satellite and atmospheric data, how to navigate the portals without losing your mind, and a Python script that downloads a SEVIRI fog-season dataset in under 10 minutes."
read_time: 10
skills: [EUMETSAT Data Store, Microservices Design, ETL Pipelines]
github: https://github.com/berkesenturk/SatelliteETL
runtime: 1-5 minutes depending on download speed
data_source: EUMETSAT Data Store (free)
prev_post: "Step 1 — What Is a Satellite Image, Really?"
prev_post_url: /blog/2026/02/18/eo-ml-day-01-what-is-a-satellite-image/
next_post: "Step 3 — Reading netCDF and HDF5 with xarray"
next_post_url: /blog/2026/02/20/eo-ml-day-03-xarray/
image: /assets/logo.png
---

Yesterday I explained what a satellite image actually is. Today we will jump right into the system design of the continuous ETL pipeline design.

For a production-scale system, which will handle petabytes of data, an architecture is needed which seperates the concerns properly to scale it in cloud environment. Therefore, microservices software design will be implemented to satisy this need. Below explains my design choices:

## Key Architectural Decisions

### 1. **Separation of Concerns**
- Each service has one responsibility
- Can scale independently
- Easy to debug and monitor

### 2. **Asynchronous Processing**
- Services communicate via message queue
- Non-blocking operations
- Handles variable processing times

### 3. **Data Latency Strategy**
- Queries data 1+ hour old (EUMETSAT near-real-time restriction for public users.)
- Configurable via `min_age_hours` setting

### 4. **Quality-First Processing**
- Quality checks before heavy processing
- Skips low-quality data early
- Tracks quality metrics in database

### 5. **Containerization**
- Each component in separate Docker container
- Easy deployment and scaling
- Isolated dependencies

---

## Source 1: EUMETSAT Data Store

# SEVIRI Data Pipeline 

<figure>
  <img src="/assets/container_diagram.png" class="large">
  <figcaption >Architecture of the SEVIRI Data Pipeline</figcaption>
</figure>


---

## Component Details

| Component | Technology | Purpose | Key Features |
|-----------|-----------|---------|--------------|
| **API Poller** | Python, FastAPI | Discovery | • Polls EUMETSAT every 15 min<br>• Queries data 1+ hour old<br>• Avoids near-real-time restrictions |
| **Downloader** | Python, Celery | Download | • Downloads .nat files<br>• 3 retry attempts<br>• Exponential backoff |
| **Processor** | Python, Celery, Satpy | Processing | • Converts .nat → NetCDF<br>• Calibrates to reflectance<br>• Reprojects to WGS84<br>• Subsets to Paris ROI |
| **Redis** | Redis 7 | Queue | • Task distribution<br>• Decouples services |
| **PostgreSQL** | PostgreSQL 15 | Database | • File manifest<br>• Status tracking<br>• Quality metrics |
| **/raw** | Docker Volume | Storage | • Temporary .nat files<br>• Deleted after processing |
| **/processed** | Docker Volume | Storage | • Final NetCDF outputs<br>• Organized by date |


---


## Technology Stack

## Overview

The project is built as a microservices architecture using Docker containers orchestrated with Docker Compose. The pipeline leverages Python as the primary programming language across all services, with specialized libraries for satellite data processing (Satpy, Pyresample), asynchronous task processing (Celery), and data management (PostgreSQL, Redis). Each component is containerized to ensure isolation, reproducibility, and easy deployment. The system follows a producer-consumer pattern where services communicate through Redis message queues, enabling parallel processing and fault tolerance. Data processing includes converting native SEVIRI format (.nat) to standardized NetCDF files, performing radiometric calibration, reprojecting from geostationary to WGS84 coordinates, and spatially subsetting to region of interest.

---
## Detailed Technology Stack

<details markdown="1"> 

<summary>Click to expand table</summary>


| Category | Technology | Purpose | Key Features |
|----------|-----------|---------|--------------|
| **Containerization** | Docker | Container runtime | • Isolated environments<br>• Reproducible builds<br>• Easy deployment |
| | Docker Compose | Multi-container orchestration | • Service dependencies<br>• Volume management<br>• Network configuration |
| **Programming Language** | Python | Core language for all services | • Rich scientific ecosystem<br>• Easy integration<br>• Excellent libraries |
| **API Framework** | FastAPI | REST API for poller service | • Async support<br>• Auto documentation<br>• Type validation |
| | Uvicorn | ASGI server | • High performance<br>• WebSocket support |
| **Task Queue** | Celery | Distributed task processing | • Async task execution<br>• Retry logic<br>• Worker scaling<br>• Task routing |
| | Redis | Message broker & result backend | • In-memory speed<br>• Pub/sub messaging<br>• Persistence options |
| **Database** | PostgreSQL | Metadata and status tracking | • ACID compliance<br>• Advanced queries<br>• Reliability |
| | psycopg2 | PostgreSQL adapter | • Efficient connections<br>• Connection pooling |
| **Satellite Data Processing** | Satpy | Satellite data reading & processing | • Multi-format support<br>• Calibration tools<br>• SEVIRI native reader |
| | Pyresample | Geospatial resampling | • Projection conversion<br>• Area definitions<br>• Nearest neighbor |
| | PyOrbital | Orbital calculations | • Satellite position<br>• Solar angles |
| **Data Handling** | xarray | N-dimensional labeled arrays | • NetCDF integration<br>• Dask support<br>• Label-based indexing |
| | NetCDF4 | NetCDF file I/O | • CF conventions<br>• Compression<br>• Metadata support |
| | NumPy | Numerical computing | • Array operations<br>• Mathematical functions |
| | Dask | Parallel computing | • Out-of-core processing<br>• Lazy evaluation |
| **Geospatial** | PyProj | Cartographic projections | • Coordinate transformations<br>• WGS84 support<br>• PROJ integration |
| | Shapely | Geometric operations | • Polygon operations<br>• Spatial relationships |
| **Data Access** | eumdac | EUMETSAT API client | • Authentication<br>• Product search<br>• Data download |
| **Scheduling** | APScheduler | Job scheduling | • Cron-like intervals<br>• Background jobs<br>• Timezone support |
| **Configuration** | PyYAML | YAML parsing | • Configuration files<br>• Human-readable |
| | python-dotenv | Environment variables | • Secure credentials<br>• Environment management |
| **Monitoring** | Prometheus Client | Metrics collection | • Custom metrics<br>• Time-series data<br>• Scraping endpoints |
| | Grafana | Visualization dashboard | • Real-time monitoring<br>• Alerting<br>• Custom dashboards |
| **Logging** | python-json-logger | Structured logging | • JSON format<br>• Easy parsing<br>• Log aggregation |
| **Utilities** | python-dateutil | Date/time parsing | • Flexible parsing<br>• Timezone handling |
| | requests | HTTP client | • API calls<br>• File downloads |
| | tqdm | Progress bars | • Visual feedback<br>• ETA calculation |

</details>

---


## Infrastructure Components

| Component | Image | Purpose | Configuration |
|-----------|-------|---------|---------------|
| **Redis** | redis:7-alpine | Message broker | • Memory: 2GB<br>• Persistence: RDB snapshots<br>• Port: 6379 |
| **PostgreSQL** | postgres:15-alpine | Metadata database | • Database: seviri_pipeline<br>• User: seviri<br>• Port: 5432 |
| **Prometheus** | prom/prometheus:latest | Metrics storage | • Retention: 15 days<br>• Port: 9090 |
| **Grafana** | grafana/grafana:latest | Monitoring UI | • Data source: Prometheus<br>• Port: 3000 |

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Polling Interval** | 15 minutes | Configurable |
| **Data Latency** | 1+ hours | To avoid EUMETSAT restrictions |
| **Download Time** | 2-4 minutes/file | Depends on network speed |
| **Processing Time** | 3-5 minutes/file | For Paris subset |
| **Concurrent Downloads** | 2 workers | Configurable |
| **Concurrent Processing** | 3 workers | Configurable |
| **Daily Throughput** | ~70-80 files | Excludes nighttime |
| **Storage per File** | ~50 MB | After compression |

---

## Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **API Credentials** | Stored in .env file, never in code |
| **Database Password** | Environment variable, not in compose file |
| **Network Isolation** | Docker bridge network (seviri-network) |
| **Container Security** | Non-root users where possible |
| **Port Exposure** | Only necessary ports exposed to host |
| **Data Validation** | Input validation in all services |
| **Error Handling** | Graceful failures, no sensitive data in logs |

---

This technology stack provides a robust, scalable, and maintainable solution for continuous SEVIRI satellite data processing, with clear separation of concerns and production-ready features like retry logic, monitoring, and quality control.

## What comes next?

This is the raw material for everything in Weeks 2–4. Tomorrow in Day 3 we open it up and actually look at it with xarray.
