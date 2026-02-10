# High-Scale Energy Ingestion Engine

A scalable backend system for ingesting and analyzing high-frequency telemetry from smart meters and electric vehicles. Built with **NestJS** and **PostgreSQL**.

## Overview

Ingests two independent telemetry streams:
- **Meter Stream (AC)** – Energy consumed from grid
- **Vehicle Stream (DC)** – Energy delivered to batteries

Correlates both streams to compute charging efficiency and vehicle performance metrics.


## Architecture

```
Devices → NestJS API → Service Layer → Repository Layer → PostgreSQL
```

Data flows through a layered backend with composite indexes for fast queries.

## Data Storage

### Hot Store (Live Tables)
Latest full telemetry snapshot for each device:

- `vehicle_live` – Latest vehicle state (SoC, delivered energy, battery temperature, timestamp)
- `meter_live` – Latest meter state (consumed energy, voltage, timestamp)


Upserted on every reading. Used for real-time queries.

### Cold Store (History Tables)
Append-only audit trail for analytics:
- `vehicle_history` – All historical vehicle readings
- `meter_history` – All historical meter readings

Used for reporting and regulatory compliance. Device mapping stored in `vehicle_meter_map`.

## Indexing

Critical composite indexes:

```sql
CREATE INDEX idx_vehicle_history_vehicle_time
  ON vehicle_history (vehicle_id, recorded_at DESC);

CREATE INDEX idx_meter_history_meter_time
  ON meter_history (meter_id, recorded_at DESC);
```

By indexing both the device identifier and timestamp, the database can perform efficient range scans for time-window analytics (e.g., last 24 hours) without scanning large history tables.


## API Endpoints

### Ingest Meter Telemetry
```http
POST /v1/ingest
{ "meterId": "M1", "kwhConsumedAc": 15.5, "voltage": 230.2, "timestamp": 1700000000 }
```

### Ingest Vehicle Telemetry
```http
POST /v1/ingest
{ "vehicleId": "V1", "soc": 80, "kwhDeliveredDc": 12.3, "batteryTemp": 34.5, "timestamp": 1700000000 }
```

### Create Device Mapping
```http
POST /v1/mappings
{ "vehicleId": "V1", "meterId": "M1" }
```

### Get Performance Metrics
```http
GET /v1/analytics/performance/V1
```

Returns last-24-hour efficiency ratio (DC / AC energy) along with Battery Average Temperature.


## Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+

### Quick Start
```bash
git clone <repository-url>
cd high-scale-energy-ingestion
docker-compose up --build
curl http://localhost:3000/health
```

## Scaling Math

Reference load:
```
10,000 devices @ 1 sample/minute
├─ Daily records:    14.4 million rows
├─ Monthly growth:   432 million rows

```

At ~100,000 devices, needs table partitioning (monthly) and read replicas. Hot-cold separation ensures live queries stay fast as history grows.

## Design Decisions

### Synchronous Ingestion (No Message Queue)
**Why:** Simpler deployment, lower latency, easier debugging.
**Trade-off:** Less resilient to traffic spikes. Reconsider if writes exceed ~50K/sec.

### Dual Hot-Cold Tables
**Why:** Live table stays small (one row per device) = fast dashboards. History grows unbounded but not queried interactively.
**Trade-off:** ~2x storage overhead.

### Raw SQL Over ORM
**Why:** Fine-grained control over indexes, better performance for batch operations.
**Trade-off:** More verbose, requires careful parameterization.

## Project Structure

```
src/
├── app.controller.ts          # REST endpoints
├── app.service.ts             # Business logic
├── repositories/              # Data access layer
└── models/                    # TypeScript interfaces
db/
└── init.sql                   # Schema & indexes
Dockerfile, docker-compose.yml, package.json
```

---

Developed as part of a backend engineering assignment.