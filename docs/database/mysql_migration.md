# KMA — MySQL Migration & Database Architecture Guide

## 1. Overview & Context

To support native deployment on Hostinger (Shared Web Hosting, cPanel/CloudLinux, or VPS) without third-party external dependencies like MongoDB Atlas, the KMA Media Production backend is configured to use **MySQL 8.0 / MariaDB** as its primary production relational database.

### Core Objectives Achieved:
1. **Zero Frontend Regressions**: The React 18 + Vite frontend, UI components, and client-side data contracts remain 100% unchanged.
2. **Zero API Breaking Changes**: All API endpoints (`/api/data`, `/api/projects`, `/api/services`, `/api/bookings`, `/api/auth/*`) retain identical JSON structures, status codes, and HTTP headers.
3. **Resilient Architecture**: Multi-tier storage fallback:
   - **Primary**: MySQL (`mysql2/promise` connection pool with auto-initialization).
   - **Secondary / Legacy**: MongoDB Atlas (if `MONGODB_URI` is provided).
   - **Offline / Local Fallback**: Persistent local JSON (`data/saved_portfolio.json`, `data/saved_bookings.json`).
4. **Clean Normalization**: Media items are stored in a dedicated `project_media` table with foreign keys (`ON DELETE CASCADE`), while retaining single-call composite hydration for the frontend.

---

## 2. MySQL Schema (DDL)

The schema DDL is stored at `api/db/schema.sql`. It is automatically executed if tables do not exist when the backend initializes, or can be imported via phpMyAdmin.

```sql
-- 1. PORTFOLIO METADATA & PROFILE
CREATE TABLE IF NOT EXISTS `portfolio` (
  `doc_id` VARCHAR(64) NOT NULL,
  `data` LONGTEXT NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) DEFAULT 'weddings',
  `category_label` VARCHAR(128) DEFAULT 'Cinematic Showcase',
  `client` VARCHAR(128) DEFAULT '',
  `location` VARCHAR(255) DEFAULT '',
  `year` VARCHAR(16) DEFAULT '',
  `date` VARCHAR(32) DEFAULT '',
  `value` VARCHAR(128) DEFAULT '',
  `description` TEXT,
  `outcome` TEXT,
  `tech_stack` LONGTEXT DEFAULT NULL,
  `live_url` VARCHAR(512) DEFAULT '',
  `github_url` VARCHAR(512) DEFAULT '',
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `is_featured` BOOLEAN DEFAULT FALSE,
  `cover_media_id` VARCHAR(64) DEFAULT '',
  `image_url` VARCHAR(1024) DEFAULT '',
  `video_url` VARCHAR(1024) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROJECT MEDIA
CREATE TABLE IF NOT EXISTS `project_media` (
  `id` VARCHAR(64) NOT NULL,
  `project_id` VARCHAR(64) NOT NULL,
  `type` ENUM('image', 'video') DEFAULT 'image',
  `url` TEXT NOT NULL,
  `thumbnail_url` TEXT,
  `title` VARCHAR(255) DEFAULT '',
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_media_project` (`project_id`),
  CONSTRAINT `fk_project_media` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SERVICES & PACKAGES
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) DEFAULT 'weddings',
  `description` TEXT,
  `items` LONGTEXT DEFAULT NULL,
  `price` VARCHAR(64) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EVENT BOOKINGS
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) DEFAULT '',
  `event_type` VARCHAR(64) DEFAULT 'wedding',
  `event_date` VARCHAR(64) DEFAULT '',
  `location` VARCHAR(255) DEFAULT '',
  `message` TEXT,
  `status` ENUM('new', 'contacted', 'confirmed', 'completed', 'cancelled') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(64) NOT NULL,
  `value` TEXT NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Hostinger MySQL Setup Step-by-Step

### Step 3.1: Create MySQL Database on Hostinger
1. Log in to your Hostinger hPanel or cPanel.
2. Navigate to **Databases** -> **MySQL Databases**.
3. Create a new Database and User:
   - **Database Name**: e.g., `u123456789_kma_db`
   - **Username**: e.g., `u123456789_kma_user`
   - **Password**: Generate a secure 24+ character password.
4. Assign all privileges to the user for the database.

### Step 3.2: Configure Environment Variables
In your production `.env` file on Hostinger:
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=u123456789_kma_user
DB_PASSWORD=your_secure_db_password
DB_NAME=u123456789_kma_db
```
*(On Hostinger shared hosting, `DB_HOST` is typically `localhost` or `127.0.0.1`)*.

### Step 3.3: Execute Migration Script
To migrate existing data from MongoDB or local JSON files into the newly created MySQL database, run:
```bash
npm run migrate:mysql
```
The migration script will:
1. Extract data from MongoDB Atlas (if configured) or local `saved_portfolio.json` and `saved_bookings.json`.
2. Connect to MySQL and automatically create all tables.
3. Migrate `portfolio`, `projects`, `project_media`, `services`, `bookings`, and `settings`.
4. Output a verification summary table confirming matching counts.

---

## 4. Verification & Health Monitoring

To verify that the application is running against MySQL:
1. Make a GET request to `/api/health`:
   ```json
   {
     "status": "online",
     "appName": "KMA Wedding & Media Production API",
     "mode": "mysql",
     "database": {
       "mysql": true,
       "mongodb": false
     },
     "timestamp": "2026-09-25T12:00:00.000Z",
     "uptime": 120.45
   }
   ```
2. Check `mode`: should equal `"mysql"`.
3. Check `database.mysql`: should equal `true`.

---

## 5. Rollback & Emergency Fallback

- If MySQL credentials are unset or the MySQL server goes offline, the backend automatically falls back to MongoDB (if configured) or the local file store without crashing.
- Pre-deployment backups are generated via:
  ```bash
  npm run backup
  ```
- Instant rollbacks to any prior snapshot can be triggered via:
  ```bash
  npm run rollback
  ```
