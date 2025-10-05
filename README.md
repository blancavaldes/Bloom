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

