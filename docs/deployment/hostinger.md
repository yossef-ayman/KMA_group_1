# Hostinger Deployment Guide — KMA Wedding & Media Production

> **STATUS**: `ARCHITECTURE & PREPARATION ONLY`  
> **EXECUTION STATUS**: `NOT EXECUTED YET`

This document details the production deployment architecture, configuration, and step-by-step checklist for hosting the KMA Media Production platform on Hostinger (VPS with Nginx or Cloud cPanel Node.js Application Manager).

---

## 1. Hosting Requirements

* **Node.js Runtime**: Node.js `v18.x`, `v20.x`, or `v22.x` (LTS recommended).
* **Package Manager**: npm `v9+` or `v10+`.
* **Process Manager**: PM2 (recommended for VPS) or Hostinger Application Manager (for Cloud/cPanel).
* **Database**: Hostinger MySQL 8.0 / MariaDB (native, no third-party cloud database required). MongoDB Atlas optional fallback.
* **Domain & DNS**: `kmawedding.com` (or production domain) pointing to the Hostinger server IP via A records.
* **SSL / TLS**: Let's Encrypt SSL certificate (HTTPS enforced).
* **RAM / CPU**: Minimum 1 vCPU and 1 GB RAM (2 GB+ recommended for media production workloads).

---

## 2. Application Architecture

In production, frontend and backend are unified under a single origin to eliminate CORS complications:

```text
                           Internet / Client
                                  │
                                HTTPS
                                  │
                       Hostinger Reverse Proxy
                       (Nginx / Cloud cPanel)
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
           GET / (SPA Routes)               GET / POST / PUT ...
           Static Assets                     /api/* & /uploads/*
                 │                                 │
                 ▼                                 ▼
           Vite Build Output               Node.js + Express
             (dist/ directory)                 (server.js)
                                                   │
                                                   ▼
                                        Hostinger MySQL 8.0 / MariaDB
                                       (or MongoDB Atlas / Local Store)
```

### Modes of Serving:
1. **Option A (All-in-One via Node/Express - Recommended default)**:
   - `server.js` listens on `process.env.PORT` (e.g. 5000).
   - Express serves static assets from `dist/` with `express.static()`.
   - Express serves all REST endpoints under `/api/*`.
   - Express falls back to `dist/index.html` for any SPA client-side routes (`/portfolio`, `/admin`, `/services`).
   - Nginx simply acts as a reverse proxy passing all port 80/443 traffic to Node.js.

2. **Option B (Nginx split - High performance)**:
   - Nginx directly serves `dist/` for static assets and HTML.
   - Nginx proxies only `/api/*` to `http://localhost:5000`.

---

## 3. Production Startup Command

```bash
# Production server entry point
npm run start
```
Which executes:
```bash
node server.js
```
Under PM2 process management:
```bash
pm2 start server.js --name "kma-production"
pm2 save
pm2 startup
```

---

## 4. Reverse Proxy Configuration (Nginx on Hostinger VPS)

```nginx
server {
    listen 80;
    server_name kmawedding.com www.kmawedding.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kmawedding.com www.kmawedding.com;

    # SSL Certificates (managed via Certbot)
    ssl_certificate /etc/letsencrypt/live/kmawedding.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kmawedding.com/privkey.pem;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Option A: Forward all requests to Express (server.js handles dist and /api)
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Required Environment Variables

Configure these variables in Hostinger's environment panel or in a secure `.env` file on the server.

> [!CAUTION]
> Never commit actual passwords, tokens, or URIs into Git.

* `NODE_ENV`: Set to `production`.
* `PORT`: Server port assigned by Hostinger or custom (e.g. `5000`).
* `DB_HOST`: MySQL host (`127.0.0.1` or `localhost` on Hostinger).
* `DB_PORT`: MySQL port (`3306`).
* `DB_USER`: Hostinger database username (e.g. `u123456789_kma_user`).
* `DB_PASSWORD`: Secure MySQL user password.
* `DB_NAME`: Hostinger database name (e.g. `u123456789_kma_db`).
* `ADMIN_PASSCODE` / `ADMIN_PASSWORD_HASH`: Production administrative passcode/hash.
* `SESSION_SECRET`: Cryptographic session salt for signing cookies.
* `MONGODB_URI`: (Optional) Legacy MongoDB connection string if fallback is desired.
* `VITE_API_URL`: Leave blank (or empty string) because frontend and API share the same domain (`/api`).

---

## 6. Deployment Steps Checklist

> [!IMPORTANT]
> **STATUS: NOT EXECUTED YET**  
> Do not execute these steps until the team gives formal authorization to begin Live Deployment.

- [ ] **Step 1: Provision Hostinger Instance & MySQL Database**
  - Provision VPS or Cloud Node.js environment on Hostinger.
  - Create MySQL database and user in Hostinger panel.
  - Verify Node.js v20+, MySQL, and Git are ready.
- [ ] **Step 2: Setup Domain & SSL**
  - Point domain DNS A records to Hostinger IP.
  - Generate Let's Encrypt SSL certificate via Certbot or Hostinger panel.
- [ ] **Step 3: Clone Codebase**
  ```bash
  git clone https://github.com/yossef-ayman/KMA_wedding_1.git /var/www/kma
  cd /var/www/kma
  ```
- [ ] **Step 4: Configure Production Environment**
  - Copy `.env.example` to `.env`.
  - Fill in MySQL credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET`.
- [ ] **Step 5: Run Data Migration & Build Frontend**
  ```bash
  npm ci --production=false
  npm run migrate:mysql
  npm run build
  ```
  - Verify that `dist/` contains `index.html` and assets.
  - Verify that MySQL tables and data are created.
- [ ] **Step 6: Launch Node Server with PM2**
  ```bash
  pm2 start server.js --name "kma-production"
  pm2 save
  pm2 startup
  ```
- [ ] **Step 7: Smoke Test Live Endpoints**
  - Check `https://kmawedding.com/api/health` -> returns `{ status: "online", mode: "mysql", database: { mysql: true } }`.
  - Check `https://kmawedding.com/` -> renders public portfolio showcase.
  - Check `https://kmawedding.com/admin` -> renders Admin login with passcode prompt.
  - Check `https://kmawedding.com/api/data` -> returns production portfolio data from MySQL.
