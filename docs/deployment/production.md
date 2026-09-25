# KMA Wedding & Media Production — Production Deployment Guide

## 1. Production Architecture

The KMA Media Production platform is designed as a unified single-origin architecture for Hostinger VPS or Cloud Node.js hosting:

```text
                                Internet
                                   │
                                 HTTPS
                                   │
                         Hostinger Reverse Proxy
                         (Nginx on Port 80/443)
                                   │
                 ┌─────────────────┴─────────────────┐
                 │                                   │
          Static Assets & SPA                API Requests & Uploads
          GET /                              /api/* & /uploads/*
                 │                                   │
                 ▼                                   ▼
          Vite Build Output                   Node.js + Express
          (dist/ directory)                      (server.js)
                                                     │
                                       ┌─────────────┴─────────────┐
                                       │                           │
                                 MongoDB Atlas               Local Filesystem
                             (Production Database)        (uploads/ & data/)
```

---

## 2. Hosting Configuration

* **Runtime**: Node.js `v20.x` or `v22.x` (LTS).
* **Process Manager**: PM2 (recommended for zero-downtime restarts and automatic boot resurrection).
* **Reverse Proxy**: Nginx (handling SSL termination, HTTP-to-HTTPS redirection, and gzip compression).
* **Port**: Internal Node.js server listens on `127.0.0.1:5000` (or `process.env.PORT`).

---

## 3. Environment Variables

Create `.env` in the application root on the production server (never commit this file to Git):

```env
# Application Environment
NODE_ENV=production

# Internal Node Server Port
PORT=5000

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/kma_production?retryWrites=true&w=majority

# Bcrypt Hash of Master Administrative Passcode
ADMIN_PASSWORD_HASH=$2a$10$abcdef... (generate with bcrypt)

# Cryptographic Salt/Secret for HTTP-Only Session Cookies (min 32 bytes)
SESSION_SECRET=a8f4c2e9b1d7463f89e2105437890abcdef1234567890abcdef1234567890abc

# Allowed CORS Origin(s) (Production domain)
CORS_ORIGIN=https://kmawedding.com

# Frontend API URL (Leave blank for same-origin /api resolution)
VITE_API_URL=
```

---

## 4. Database Setup (MongoDB Atlas)

1. Provision an M0 (Free) or M10+ cluster on MongoDB Atlas in your nearest AWS/GCP region (e.g. Frankfurt or Bahrain for Middle East/Egypt visitors).
2. Create a dedicated database user (e.g. `kma_admin`) with read/write access.
3. Whitelist the Hostinger server IP address in MongoDB Atlas Network Access.
4. Set `MONGODB_URI` in `.env`.
5. Note: The server automatically creates collections (`portfolios`, `projects`, `bookings`, `settings`) on first startup without requiring manual schema creation or destructive migrations.

---

## 5. Authentication Architecture

* **Server-Side Verification**: Authentication is fully server-side. Setting `localStorage` flags in the browser does NOT grant access to mutation endpoints.
* **Passcode Hashing**: Admin passcodes are hashed using `bcrypt` (10 rounds).
* **Session Cookies**: Upon successful login (`POST /api/auth/login`), the server issues an HTTP-only, `SameSite=Strict` cookie (`kma_admin_session`) signed with HMAC-SHA256.
* **Protected Routes**:
  - `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
  - `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id`
  - `POST /api/data`
  - `POST /api/media/upload`
  - `PATCH /api/bookings/:id/status`, `DELETE /api/bookings/:id`
* **Public Routes**:
  - `GET /api/projects`, `GET /api/services`, `GET /api/health`, `GET /api/data`
  - `POST /api/bookings` (rate-limited to 15 per 15 mins with strict payload sanitization)

---

## 6. Production Media Storage

* Uploaded files are handled via `POST /api/media/upload` (guarded by `requireAdminAuth`).
* Uploaded files are stored in the server's `./uploads` directory with cryptographically unguessable filenames (`kma-<timestamp>-<random-hex>.<ext>`).
* Maximum file sizes: 10MB for images, 50MB for video clips.
* Allowed MIME types: JPEG, PNG, WebP, GIF, MP4, WebM, QuickTime.
* Uploads are served directly at `https://kmawedding.com/uploads/<filename>`.
* External video streaming (YouTube, Vimeo, Google Drive) and existing image URLs are 100% supported and preserved.

---

## 7. Step-by-Step Deployment Guide (Hostinger VPS)

### Step 1: Server Provisioning
```bash
ssh root@<HOSTINGER_VPS_IP>
apt update && apt upgrade -y
apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

### Step 2: Clone Application
```bash
mkdir -p /var/www/kmawedding
git clone https://github.com/yossef-ayman/KMA_wedding_1.git /var/www/kmawedding
cd /var/www/kmawedding
```

### Step 3: Configure Environment
```bash
cp .env.example .env
nano .env # Paste production values (MONGODB_URI, ADMIN_PASSWORD_HASH, SESSION_SECRET)
```

### Step 4: Install Dependencies & Build
```bash
npm ci --production=false
npm run build
```

### Step 5: Start PM2 Process
```bash
pm2 start server.js --name "kma-production"
pm2 save
pm2 startup
```

### Step 6: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/kmawedding.conf`:
```nginx
server {
    listen 80;
    server_name kmawedding.com www.kmawedding.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable and reload:
```bash
ln -s /etc/nginx/sites-available/kmawedding.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 8. DNS & HTTPS Setup

1. Point your domain DNS A records:
   - `@` -> `<HOSTINGER_VPS_IP>`
   - `www` -> `<HOSTINGER_VPS_IP>`
2. Issue Let's Encrypt SSL:
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d kmawedding.com -d www.kmawedding.com
   ```
3. Certbot automatically configures HTTPS redirection and sets up automatic renewal.

---

## 9. Backup Strategy

* Run the automated backup command before any update:
  ```bash
  npm run backup
  ```
* Backups are saved to `./backups/backup_<timestamp>` with a `manifest.json` file.
* Recommended cron job for daily automated backups:
  ```bash
  0 3 * * * cd /var/www/kmawedding && npm run backup >> /var/log/kma-backup.log 2>&1
  ```

---

## 10. Rollback Strategy

If a deployment or data modification encounters issues:
```bash
# Rollback to the most recent backup
npm run rollback

# Or rollback to a specific timestamped backup
node scripts/rollback.js backup_2026-09-25T07-56-49-300Z

# Restart application
pm2 restart kma-production
```

---

## 11. Troubleshooting

* **Server returns 502 Bad Gateway**:
  Check PM2 status: `pm2 status`. Check error logs: `pm2 logs kma-production --lines 50`.
* **Database not connecting**:
  Verify MongoDB Atlas IP access list includes Hostinger VPS IP. Test connection: `node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('OK'))"`.
* **Login fails after password change**:
  Generate fresh hash: `node -e "require('bcryptjs').hash('YourPassword', 10).then(console.log)"` and update `ADMIN_PASSWORD_HASH` in `.env`.
