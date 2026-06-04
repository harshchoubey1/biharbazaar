# Vercel Deployment Guide

## Steps to deploy Bihar Bazaar on Vercel

### 1. Create a free Turso database
```bash
# Install Turso CLI
npm install -g @tursodatabase/turso-cli
turso auth login
turso db create biharbazaar
turso db show biharbazaar          # copy the URL (libsql://...)
turso db tokens create biharbazaar # copy the token
```

### 2. Push schema to Turso
```bash
# Set env vars temporarily for migration
$env:DATABASE_URL="libsql://YOUR_DB_URL"
$env:DATABASE_AUTH_TOKEN="YOUR_TOKEN"
npx prisma db push
```

### 3. Add env vars on Vercel dashboard
- DATABASE_URL = libsql://YOUR_DB_URL
- DATABASE_AUTH_TOKEN = YOUR_TOKEN
- AUTH_SECRET = (generate: openssl rand -base64 32)
- AUTH_URL = https://your-app.vercel.app
- GOOGLE_CLIENT_ID = (your existing value)
- GOOGLE_CLIENT_SECRET = (your existing value)
