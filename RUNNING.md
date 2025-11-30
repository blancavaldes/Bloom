RUNNING.md — How to run, test, and deploy Bloom (quick)

Run locally (Docker Compose)

1) Start the stack (app + MySQL):

```bash
docker compose up --build -d
```

2) Check running services:

```bash
docker compose ps
```

3) View logs:

```bash
docker compose logs -f app
docker compose logs -f db
```

4) Health check:

```bash
curl -i http://localhost:3000/health
```

Notes:
- By default MySQL in `docker-compose.yml` is not bound to a host port to avoid conflicts with local MySQL installs. Use `docker compose exec db mysql -u root -p` to run CLI commands against the containerized DB.

Run tests (local):

```bash
npm test
```

CI / Deployment (high level)

- Tests are run in GitHub Actions and coverage is enforced. The `main` branch is configured to build and push a container image to Azure Container Registry and update an Azure Web App for Containers.
- Add required secrets in your GitHub repository: `AZURE_CREDENTIALS`, `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`, and DB/SESSION secrets.

Quick troubleshooting

- If `docker compose up` fails with a host port conflict on 3306, ensure no local MySQL is listening on that port, or edit `docker-compose.yml` to temporarily map a different host port (e.g., `3307:3306`).
- If the DB container fails initialization because `MYSQL_USER` is set to `root`, remove `MYSQL_USER`/`MYSQL_PASSWORD` from the DB service environment (the `MYSQL_ROOT_PASSWORD` variable is sufficient to initialize a root account).

