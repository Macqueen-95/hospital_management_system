# Hospital Management System (HMS)

A university Software Engineering project built with React, Node.js, Express, and MySQL.

---

## Technology Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React + Vite + Tailwind CSS |
| Backend    | Node.js + Express.js |
| Database   | MySQL               |
| Auth (later) | bcrypt + JWT      |

---

## Project Structure

```
Hospital_Management_System/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
│   ├── config/      # Database connection
│   ├── routes/      # API route definitions
│   ├── controllers/ # Route handler logic (future phases)
│   ├── models/      # Database models (future phases)
│   ├── middleware/  # Custom middleware (future phases)
│   └── utils/       # Utility functions (future phases)
├── database/        # SQL scripts
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- [MySQL](https://dev.mysql.com/downloads/mysql/) v8 or higher
- npm (comes with Node.js)

Verify your versions:
```bash
node --version
mysql --version
```

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Hospital_Management_System
```

### 2. Set up the backend

```bash
cd server
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management_system
DB_PORT=3306
```

### 4. Create the MySQL database

```bash
mysql -u root -p
```

Inside MySQL:
```sql
CREATE DATABASE hospital_management_system;
exit
```

### 5. Set up the frontend

```bash
cd ../client
npm install
```

---

## Running the Application

### Start the backend

```bash
cd server
node server.js
```

Backend runs on: `http://localhost:5000`

### Start the frontend

Open a second terminal:

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Verifying the Connection

Open your browser and go to `http://localhost:5173`

You should see:
- **Backend: Connected**
- **Database: Connected**

You can also test the API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Database test
curl http://localhost:5000/api/db-test
```

---

## Environment Variables

Never commit your `.env` file. Use `.env.example` as a template.

| Variable      | Description                  |
|---------------|------------------------------|
| `PORT`        | Port the Express server runs on |
| `DB_HOST`     | MySQL host (usually localhost) |
| `DB_USER`     | MySQL username               |
| `DB_PASSWORD` | MySQL password               |
| `DB_NAME`     | Database name                |
| `DB_PORT`     | MySQL port (usually 3306)    |

---

## Development Phases

- **Phase 1** — Project Setup ✅
- **Phase 2** — Database Schema
- **Phase 3** — Authentication
- **Phase 4** — Dashboard
- **Phase 5** — Patient Management
- **Phase 6** — Doctor Management
- **Phase 7** — Appointment Management
- **Phase 8** — Consultation
- **Phase 9** — Admission
- **Phase 10** — Billing
- **Phase 11** — Discharge
- **Phase 12** — Follow-up
