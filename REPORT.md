REPORT — Bloom


Note: This work assumes a Node.js/Express app with MySQL persistence. Local dev uses Docker Compose to run the app and DB together; CI uses GitHub Actions to run tests and optionally build/push an image to Azure Container Registry and configure an Azure Web App for Containers.

Design & Architecture Changes
-----------------------------
Refactor for testability
- App factory: The Express initialization was moved into a `createApp(options)` factory (in `src/app.js`) so test code can import the app instance directly without starting the real network listener. This allows Supertest to attach to the app and exercise routes in-process.
- DB abstraction: The database helper (`src/utils/db.js`) was extended with helper functions to inject a test pool or a mock. This allowed tests to run quickly by mocking SQL responses and focusing on route and logic behavior.

Testing
-------
- Frameworks: Jest (test runner) and Supertest (HTTP assertions) were used. The project is ESM; tests use `NODE_OPTIONS=--experimental-vm-modules` in `package.json` to run reliably, and some tests adopt `.cjs` wrappers when necessary to mock ESM imports.
- Coverage: Jest `coverageThreshold` was set with a global minimum of 70% across statements, branches, functions, and lines. The CI job runs tests and fails if coverage is below the threshold.
- Test files: The test suite includes authentication tests (register/login/logout), basic route coverage for workouts/meals/journal, and unit tests for utilities. The DB layer is mocked for unit tests; integration tests can be run against a test database if desired.
- Reproducible commands: `npm test` runs tests and outputs coverage. The GitHub Actions workflow also uploads coverage artifacts for review.

Containerization and Deployment
-------------------------------
- Dockerfile: The app is packaged with a `Dockerfile` using `node:18-alpine`. The image installs production dependencies and starts the app with `node src/server.js`.
- Docker Compose: `docker-compose.yml` was added to run `app` and `db` together. For local safety, the `db` service does not publish port 3306 to the host by default (avoids conflicts with local DBs). The `app` service maps port `3000:3000` to allow host access.
- CI/CD: Two GitHub Actions workflows exist:
  - `azure-deploy.yml`: runs tests and, if secrets for Azure are configured, sets App Settings and deploys the repository content to an Azure Web App using `azure/webapps-deploy`.
  - `azure-container-deploy.yml`: builds a container image and pushes to ACR, then configures the App Service to use the pushed image. This workflow triggers only on pushes to `main`.
- Secrets: The pipeline expects repository secrets (e.g., `AZURE_CREDENTIALS`, `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`, `DB_*`, and `SESSION_SECRET`) so sensitive values are not stored in the repo.

Monitoring and Health
---------------------
- `/health` endpoint: A simple `GET /health` returns service readiness JSON. The App responds with HTTP 200 when it is initialized and able to accept requests.
- Metrics: The app includes a metrics endpoint (exposed at `/metrics` when enabled). Metrics expected include:
  - `http_requests_total` (counter) – total requests by status/method/path
  - `http_request_duration_seconds_bucket` (histogram) – request latencies
  - Derived metrics: request rate (requests/sec), p95 latency, error rate (5xx fraction)
- Prometheus config: A minimal `monitoring/prometheus.yml` was created to scrape `http://host.docker.internal:3000/metrics` for local setups. If Prometheus runs inside the same Docker network, use `app:3000` as the target.
- Grafana dashboard: A minimal dashboard JSON (`monitoring/grafana_dashboard.json`) defines three panels: request rate, p95 latency, and error rate. This is a starter dashboard you can import into a local Grafana instance.

Implementation Notes & Pitfalls
------------------------------
- MySQL entrypoint: The MySQL official image errors when `MYSQL_USER=root` is set (it conflicts with root initialization). The compose file was adjusted to rely on `MYSQL_ROOT_PASSWORD` for root creation and not set `MYSQL_USER=root`.
- Host port conflict: Many developers have local MySQL instances that bind host port 3306. The compose file by default avoids binding the container's 3306 to the host to prevent collisions. If you need host access, temporarily change the mapping to `3307:3306`.
- ESM + Jest: Running Jest with Node ESM required `--experimental-vm-modules` in the test command and some `.cjs` shims for particular tests. If you see odd import errors, ensure the test runner command uses `NODE_OPTIONS` as used in `package.json`.

How to run locally
-------------------
Prerequisites: Docker & Docker Compose, Node.js

1. Start services (in repo root):

```bash
# build images and start in background
docker compose up --build -d

# show status
docker compose ps

# view logs
docker compose logs -f app
```

2. Verify health

```bash
curl -i http://localhost:3000/health
```

3. Run tests

```bash
npm test
```

4. Run Prometheus (optional)
- Download Prometheus, add `monitoring/prometheus.yml` as its config, and run Prometheus. If Prometheus runs on the host, the scrape target is `host.docker.internal:3000`.

5. Import the Grafana dashboard
- In Grafana, import `monitoring/grafana_dashboard.json` (Dashboard -> Import) and point the panels to the Prometheus datasource.

CI / Deployment Overview
------------------------
- Pushes to `main` run the container-build workflow and the test+deploy workflow. The test workflow runs on every push; the container deploy runs on `main` and requires Azure secrets.
- To prepare production: create an ACR, push the image, create an App Service for Containers, enable system-assigned managed identity, assign `AcrPull` role to the web app identity, and set App Settings for DB and `SESSION_SECRET`.

Appendix: Reproduction commands

```bash
# build and start app+db
docker compose up --build -d
# run tests
npm test
# run Prometheus with monitoring/prometheus.yml
# import monitoring/grafana_dashboard.json into Grafana
```
