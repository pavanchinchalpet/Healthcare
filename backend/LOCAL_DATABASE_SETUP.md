# Local PostgreSQL Setup Instructions

## Option 3: Use Local PostgreSQL (Recommended for Development)

### Install PostgreSQL locally:
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install with default settings
3. Remember the password you set for 'postgres' user

### Create Database:
```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create database
CREATE DATABASE healthcare_db;

-- Create user (optional)
CREATE USER healthcare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE healthcare_db TO healthcare_user;
```

### Update .env file:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/healthcare_db
PORT=3001
```

### Alternative .env for local development:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=healthcare_db
PORT=3001
```
