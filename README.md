# Bloom - Wellness Tracker

A modern, minimal wellness tracking application that helps you track movement, meals, and mindfulness practices.

## Features

- Exercise tracking, food logging, and a mindfulness journal
- Session-based authentication and secure password hashing
- Dockerized for local development and CI/CD

## Quick Start (development)

Prerequisites:
- Node.js (v14+)
- Docker & Docker Compose (for local stack)

1. Clone the repo

```bash
git clone <repository-url>
cd Bloom
```

2. Start the app and MySQL (recommended)

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f app
curl -i http://localhost:3000/health
```

3. Run tests

```bash
npm test
```

Notes:
- `docker-compose.yml` runs MySQL without publishing port `3306` to the host by default to avoid conflicts with any local MySQL service. Use `docker compose exec db mysql -u root -p` or temporarily map a host port (e.g., `3307:3306`) if you need host access.

## Health & Monitoring

- Health endpoint: `GET /health` (returns JSON readiness/status).
- Metrics: the app exposes a `/metrics` endpoint when the metrics exporter is enabled. A minimal Prometheus scrape config is provided in `monitoring/prometheus.yml` (optional).

## CI / Deployment

- GitHub Actions run tests (with coverage) and build/push a container image for deployment to Azure when pushing to `main`.
- Store production secrets in GitHub repository secrets or your cloud provider's secret store.

Required repository secrets for deployment (example):
- `AZURE_CREDENTIALS`, `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
- `SESSION_SECRET`

## Files of interest
- `Dockerfile`, `.dockerignore` — container image for the app
- `docker-compose.yml` — app + MySQL for local development
- `src/` — application source
- `sql/schema.sql` — DB schema
- `tests/` — Jest + Supertest tests
- `REPORT.md`, `RUNNING.md` — short report and run instructions

## Short Report

See `REPORT.md` for a concise summary of improvements made for the assignment (testing, coverage, containerization, CI, and monitoring).