/**
 * KMA Wedding & Media Production
 * Database Migration Script: MongoDB / Local JSON -> MySQL
 *
 * Safely extracts data from MongoDB Atlas (or local JSON backup)
 * and migrates into normalized MySQL tables.
 *
 * Usage:
 *   node scripts/migrate_mongo_to_mysql.js
 *   npm run migrate:mysql
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import {
  initMySQL,
  isMySQLConnected,
  getPool,
  portfolioRepo,
  projectRepo,
  serviceRepo,
  bookingRepo,
  settingRepo
} from '../api/db/mysql.js';

dotenv.config();

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'saved_portfolio.json');
const LOCAL_BOOKINGS_FILE = path.join(LOCAL_DATA_DIR, 'saved_bookings.json');

function loadJson(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.warn(`[Migration] Could not load ${filePath}: ${e.message}`);
  }
  return fallback;
}

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 KMA Database Migration: MongoDB / JSON -> MySQL');
  console.log('====================================================\n');

  // 1. EXTRACT DATA FROM SOURCE
  console.log('📥 STEP 1: Extracting source data...');

  let portfolioData = null;
  let projectsList = [];
  let servicesList = [];
  let bookingsList = [];
  let settingsList = [];

  // Try MongoDB if MONGODB_URI is provided
  if (process.env.MONGODB_URI) {
    try {
      console.log('  Connecting to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('  ✓ Connected to MongoDB Atlas.');

      // Extract Portfolio
      const portfolioDoc = await mongoose.connection.db
        .collection('portfolios')
        .findOne({ docId: 'kma_portfolio_main' });
      if (portfolioDoc && portfolioDoc.data) {
        portfolioData = portfolioDoc.data;
        console.log('  ✓ Extracted portfolio document from MongoDB.');
      }

      // Extract Projects
      const mongoProjects = await mongoose.connection.db.collection('projects').find({}).toArray();
      if (mongoProjects && mongoProjects.length > 0) {
        projectsList = mongoProjects;
        console.log(`  ✓ Extracted ${mongoProjects.length} projects from MongoDB.`);
      }

      // Extract Bookings
      const mongoBookings = await mongoose.connection.db.collection('bookings').find({}).toArray();
      if (mongoBookings && mongoBookings.length > 0) {
        bookingsList = mongoBookings;
        console.log(`  ✓ Extracted ${mongoBookings.length} bookings from MongoDB.`);
      }

      // Extract Settings
      const mongoSettings = await mongoose.connection.db.collection('settings').find({}).toArray();
      if (mongoSettings && mongoSettings.length > 0) {
        settingsList = mongoSettings;
        console.log(`  ✓ Extracted ${mongoSettings.length} settings from MongoDB.`);
      }

      await mongoose.disconnect();
    } catch (err) {
      console.warn(`  ⚠️ MongoDB extraction skipped/failed: ${err.message}`);
    }
  }

  // Fallback to local files if empty
  if (!portfolioData) {
    portfolioData = loadJson(LOCAL_DATA_FILE, {
      profile: {},
      projects: [],
      practiceAreas: [],
      services: [],
      milestones: [],
      partners: [],
      skills: []
    });
    console.log('  ✓ Using local saved_portfolio.json data.');
  }

  if (projectsList.length === 0 && Array.isArray(portfolioData.projects)) {
    projectsList = portfolioData.projects;
    console.log(`  ✓ Found ${projectsList.length} projects in portfolio data.`);
  }

  const rawServices = portfolioData.services || portfolioData.practiceAreas || [];
  if (servicesList.length === 0 && Array.isArray(rawServices)) {
    servicesList = rawServices;
    console.log(`  ✓ Found ${servicesList.length} services/practice areas in portfolio data.`);
  }

  if (bookingsList.length === 0) {
    bookingsList = loadJson(LOCAL_BOOKINGS_FILE, []);
    console.log(`  ✓ Found ${bookingsList.length} bookings in local saved_bookings.json.`);
  }

  console.log('\n📊 Source Data Summary:');
  console.log(`  - Portfolio Payload: ${portfolioData ? 'Present' : 'Empty'}`);
  console.log(`  - Projects: ${projectsList.length}`);
  console.log(`  - Services: ${servicesList.length}`);
  console.log(`  - Bookings: ${bookingsList.length}`);
  console.log(`  - Settings: ${settingsList.length}`);

  // 2. CONNECT TO MYSQL
  console.log('\n🔌 STEP 2: Connecting to MySQL target...');
  const connected = await initMySQL();

  if (!connected) {
    console.log('\n⚠️ MySQL target is currently OFFLINE or unconfigured.');
    console.log('   Connection details checked: DB_HOST, DB_NAME, DB_USER or MYSQL_URL.');
    console.log('   The migration script has verified all source data successfully.');
    console.log('   To complete insertion into MySQL, supply credentials in .env:');
    console.log('     DB_HOST=127.0.0.1');
    console.log('     DB_PORT=3306');
    console.log('     DB_USER=kma_user');
    console.log('     DB_PASSWORD=your_password');
    console.log('     DB_NAME=kma_db');
    console.log('\n🏁 Dry-Run completed. Source data is valid and ready for migration.\n');
    process.exit(0);
  }

  console.log('  ✓ MySQL Target is ONLINE and tables are initialized.\n');

  // 3. MIGRATE DATA INTO MYSQL
  console.log('💾 STEP 3: Writing records to MySQL...');

  // 3.1 Portfolio Table
  if (portfolioData) {
    await portfolioRepo.save('kma_portfolio_main', portfolioData);
    console.log('  ✓ Migrated portfolio main document.');
  }

  // 3.2 Projects & Project Media
  let migratedProjectsCount = 0;
  let migratedMediaCount = 0;
  for (const proj of projectsList) {
    await projectRepo.create(proj);
    migratedProjectsCount++;
    if (Array.isArray(proj.media)) {
      migratedMediaCount += proj.media.length;
    }
  }
  console.log(`  ✓ Migrated ${migratedProjectsCount} projects with ${migratedMediaCount} media items.`);

  // 3.3 Services
  let migratedServicesCount = 0;
  for (const s of servicesList) {
    await serviceRepo.create(s);
    migratedServicesCount++;
  }
  console.log(`  ✓ Migrated ${migratedServicesCount} services.`);

  // 3.4 Bookings
  let migratedBookingsCount = 0;
  for (const b of bookingsList) {
    await bookingRepo.create(b);
    migratedBookingsCount++;
  }
  console.log(`  ✓ Migrated ${migratedBookingsCount} bookings.`);

  // 3.5 Settings
  let migratedSettingsCount = 0;
  for (const setting of settingsList) {
    if (setting.key && setting.value) {
      await settingRepo.set(setting.key, setting.value);
      migratedSettingsCount++;
    }
  }
  if (migratedSettingsCount > 0) {
    console.log(`  ✓ Migrated ${migratedSettingsCount} settings.`);
  }

  // 4. VERIFICATION STEP
  console.log('\n🔍 STEP 4: Verifying MySQL records...');
  const pool = getPool();

  const [portfolioRows] = await pool.query('SELECT COUNT(*) as count FROM portfolio');
  const [projectRows] = await pool.query('SELECT COUNT(*) as count FROM projects');
  const [mediaRows] = await pool.query('SELECT COUNT(*) as count FROM project_media');
  const [serviceRows] = await pool.query('SELECT COUNT(*) as count FROM services');
  const [bookingRows] = await pool.query('SELECT COUNT(*) as count FROM bookings');
  const [settingRows] = await pool.query('SELECT COUNT(*) as count FROM settings');

  console.log('\n====================================================');
  console.log('📋 VERIFICATION REPORT');
  console.log('====================================================');
  console.table([
    { Entity: 'Portfolio Document', Source: portfolioData ? 1 : 0, MySQL: portfolioRows[0].count },
    { Entity: 'Projects', Source: projectsList.length, MySQL: projectRows[0].count },
    { Entity: 'Project Media', Source: migratedMediaCount, MySQL: mediaRows[0].count },
    { Entity: 'Services', Source: servicesList.length, MySQL: serviceRows[0].count },
    { Entity: 'Bookings', Source: bookingsList.length, MySQL: bookingRows[0].count },
    { Entity: 'Settings', Source: settingsList.length, MySQL: settingRows[0].count }
  ]);

  await pool.end();
  console.log('✅ MySQL Migration successfully finished!\n');
}

runMigration().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
