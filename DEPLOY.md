# Deployment Guide

This document explains how to run the application locally with Docker Compose and how to deploy a containerized image to Azure using the GitHub Actions workflow.

WARNING: Do not commit secrets or credentials to the repository. Use repository secrets or environment secrets in GitHub Actions.

## Local development (Docker Compose)

1. Create an untracked `.env` file in the repo root (example):

```bash
cat > .env <<'EOF'
DB_ROOT_PASSWORD=blanca2004
DB_DATABASE=bloom
DB_USER=root
DB_PASSWORD=blanca2004
SESSION_SECRET=abc
EOF
```

2. Start the containers:

```bash
docker compose up --build -d
```

3. View logs:

```bash
docker compose logs -f
```

4. Stop and remove containers:

```bash
docker compose down
```

The app container connects to the MySQL container using `DB_HOST=db`.

## Prepare Azure resources (one-time, run locally after `az login`)

Replace placeholders before running commands.

```bash
RG="my-resource-group"
LOCATION="eastus"
ACR_NAME="myuniquearcname"
PLAN_NAME="bloom-plan"
APP_NAME="my-bloom-app"

# create resource group
az group create --name $RG --location $LOCATION

# create ACR
az acr create --resource-group $RG --name $ACR_NAME --sku Basic --admin-enabled true

# create app service plan (Linux)
az appservice plan create --name $PLAN_NAME --resource-group $RG --is-linux --sku B1

# create web app configured for container
az webapp create --resource-group $RG --plan $PLAN_NAME --name $APP_NAME --deployment-container-image-name hello-world
```

After creating resources, add the following repository secrets:

- `AZURE_CREDENTIALS` (service principal JSON)
- `AZURE_WEBAPP_NAME` (App Service name)
- `AZURE_RESOURCE_GROUP` (resource group name)
- `ACR_NAME` (ACR login name)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `SESSION_SECRET`

## Automated deploy (GitHub Actions)

The provided workflow `.github/workflows/azure-container-deploy.yml` runs on `push` to `main`. It:

- logs into Azure using `AZURE_CREDENTIALS`
- logs into ACR and pushes an image tagged with the commit SHA
- configures the App Service to use the new image
- sets app settings from repository secrets

Make sure only `main` is configured to auto-deploy. You can enable branch protection rules (Settings → Branches) to require passing checks and PR reviews before merging.

## Rollback

To rollback, either:

- use `az webapp config container set` to point to a previously pushed image tag, or
- deploy a previous commit to `main` (reverting the commit or re-applying the older image tag).

## Notes

- The workflow requires the `ACR_NAME`, `AZURE_WEBAPP_NAME`, and `AZURE_RESOURCE_GROUP` secrets to be set for a successful deploy. Do not store credentials in the repo.
- If you want manual approvals for production deploys, create an environment (Settings → Environments) and move production secrets there, then add `environment: production` to the deploy job.
