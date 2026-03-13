# Database Setup Guide

This guide will help you configure the database connection for Brush&Coin web application.

## Quick Setup

### 1. Create `.env.local` file

Create a file named `.env.local` in the `web` directory with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# API Configuration (optional)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws
```

### 2. Database Connection String Format

The `DATABASE_URL` follows this format:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

#### Examples:

**Local PostgreSQL:**
```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/brushandcoin
```

**Neon (Cloud PostgreSQL):**
```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/brushandcoin?sslmode=require
```

**Supabase:**
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**Railway:**
```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

**Using OpenSSL:**
```bash
openssl rand -base64 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then add it to `.env.local`:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

### 4. Database Schema

Make sure your database has the `users` table with the following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE,
  user_type VARCHAR(20) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  bio TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Test the Connection

After setting up `.env.local`, restart your development server:

```bash
cd web
npm run dev
```

You should see:
- ✅ Database connection successful (if configured)
- ⚠️ Using mock authentication (if DATABASE_URL not set)

## Troubleshooting

### Error: "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"

This means your `DATABASE_URL` is malformed. Check:
1. The password contains special characters - URL encode them
2. The connection string format is correct
3. No extra spaces or quotes around the URL

### Error: "Database not configured"

This means `DATABASE_URL` is not set. The app will automatically use mock authentication in development mode.

### Error: "Connection refused"

Check:
1. Database server is running
2. Host and port are correct
3. Firewall allows connections
4. SSL mode is correct (for cloud databases)

## Mock Authentication (Development Only)

If you don't have a database set up yet, the app will automatically use mock authentication in development mode with these test accounts:

- **Artist**: `test@example.com` / `password123`
- **Admin**: `admin@example.com` / `admin123`
- **Client**: `client@example.com` / `client123`

## Production Setup

For production:
1. Use a managed PostgreSQL service (Neon, Supabase, Railway, etc.)
2. Set strong `NEXTAUTH_SECRET`
3. Use environment variables (not `.env.local`)
4. Enable SSL for database connections
5. Set up proper database backups


