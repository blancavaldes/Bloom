# Bloom - Wellness Tracker

A modern, minimal wellness tracking application that helps you track your movement, meals, and mindfulness practices.

## Features

- **Exercise Tracking**: Log workouts with type, duration, and notes
- **Food Logging**: Track meals with nutritional information
- **Mindfulness Journal**: Record daily reflections and mindfulness practices
- **User Authentication**: Secure login and registration system
- **Clean UI**: Modern, bubbly design with responsive layout

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 8.0 or higher)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Bloom
```

### 2. Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

This will create the `node_modules` folder and install all dependencies listed in `package.json`, including:
- Express.js (web framework)
- MySQL2 (database driver)
- Express-session (session management)
- Helmet (security middleware)
- Bcryptjs (password hashing)

### 3. Database Setup

#### Install MySQL

**On macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**On Windows:**
Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)

#### Create Database and User

1. **Connect to MySQL:**
```bash
mysql -u root -p
```

2. **Create the database:**
```sql
CREATE DATABASE bloom;
```

3. **Create a dedicated user (recommended):**
```sql
CREATE USER 'bloom_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON bloom.* TO 'bloom_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Exit MySQL:**
```sql
EXIT;
```

#### Import Database Schema

Import the database schema to create all necessary tables:

```bash
mysql -u bloom_user -p bloom < sql/schema.sql
```

This will create the following tables:
- `users` - User accounts and authentication
- `workouts` - Exercise tracking data
- `meals` - Food logging data
- `journal_entries` - Mindfulness journal entries

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_USER=bloom_user
DB_PASSWORD=your_secure_password
DB_DATABASE=bloom
SESSION_SECRET=your_session_secret_key_here
```

**Important:** Replace `your_secure_password` with the password you set for the MySQL user, and generate a secure session secret key.

### 5. Start the Application

```bash
npm start
```

The server will start on `http://localhost:3000`

## Project Structure

```
Bloom/
├── src/
│   ├── public/           # Frontend files
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Client-side JavaScript
│   │   ├── img/         # Images and assets
│   │   └── *.html       # HTML pages
│   ├── routes/          # Express.js route handlers
│   │   ├── auth.js      # Authentication routes
│   │   ├── workouts.js  # Exercise tracking API
│   │   ├── meals.js     # Food logging API
│   │   └── journal.js   # Mindfulness journal API
│   ├── utils/           # Utility functions
│   │   └── db.js        # Database connection
│   └── server.js        # Main server file
├── sql/
│   └── schema.sql       # Database schema
├── node_modules/        # Dependencies (created by npm install)
├── package.json         # Project dependencies and scripts
└── README.md           # This file
```

## Database Schema

The application uses the following main tables:

- **users**: Stores user account information
- **workouts**: Exercise tracking data (date, type, duration, notes)
- **meals**: Food logging data (date, name, calories, notes)
- **journal_entries**: Mindfulness journal (date, title, content, mood)

## Deployment to Azure (CI/CD)

This project includes a GitHub Actions workflow that can build and deploy the app to an **Azure Web App**. The workflow file is `.github/workflows/azure-deploy.yml` and runs on pushes to `main`.

High-level steps to deploy from GitHub to Azure:

- Create the Azure resources (resource group, App Service plan, Web App, and a MySQL server).
- Configure database and import `sql/schema.sql` into the MySQL server.
- Add necessary repository secrets (see below).
- Push changes to `main` and the workflow will run and deploy the site.

Important GitHub secrets to set (Repository -> Settings -> Secrets):

- `AZURE_CREDENTIALS` — the service principal JSON your professor gave you. This is used by the `azure/login` action.
- `AZURE_WEBAPP_NAME` — the name of the App Service Web App you created.
- `AZURE_RESOURCE_GROUP` — resource group that contains the Web App.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` — database connection values for production.
- `SESSION_SECRET` — a strong secret for sessions in production.

Quick Azure CLI example (you can run these locally after logging in with `az login`):

```bash
# create a resource group
az group create --name bloom-rg --location eastus

# create an App Service plan (Linux)
az appservice plan create --name bloom-plan --resource-group bloom-rg --is-linux --sku B1

# create the Web App (replace <app-name> with a globally unique name)
az webapp create --resource-group bloom-rg --plan bloom-plan --name <app-name> --runtime "NODE|18-lts"

# (Recommended) Create an Azure Database for MySQL server and configure networking. See Azure docs for exact commands.
```

After creating the Web App and database, add the production DB values and `SESSION_SECRET` to the Web App configuration or set them as GitHub secrets and enable the optional configuration step in the workflow.

Notes:
- The workflow currently deploys the full repository root to the Web App. The `start` script in `package.json` uses `src/server.js`, so App Service will start the Node process correctly.
- The workflow includes a step to set App Settings via the CLI when `AZURE_WEBAPP_NAME` and `AZURE_RESOURCE_GROUP` are present as secrets. This will configure the Web App to have the same environment variables used locally.

If you'd like, I can:

- Create a Dockerfile and modify the workflow to deploy a container to Azure App Service for Containers, or
- Create a small script that runs the DB migration automatically during deployment, or
- Draft the 5–6 page report (SDLC, architecture diagram, reflection) and produce a UML/architecture diagram image.


