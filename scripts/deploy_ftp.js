/**
 * KMA Wedding & Media Production
 * Automated Hostinger FTP Deployment Script
 *
 * Builds the frontend and deploys the production files to Hostinger FTP (public_html).
 *
 * Usage:
 *   npm run deploy
 */

import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config();

const FTP_HOST = process.env.FTP_HOST || '217.65.157.157';
const FTP_PORT = parseInt(process.env.FTP_PORT, 10) || 21;
const FTP_USER = process.env.FTP_USER || 'u460510257';
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_REMOTE_DIR = process.env.FTP_REMOTE_DIR || 'public_html';

async function deploy() {
  console.log('====================================================');
  console.log('🚀 KMA Hostinger FTP Deployment Starting...');
  console.log('====================================================\n');

  if (!FTP_PASSWORD) {
    console.error('❌ Error: FTP_PASSWORD is missing in your .env file.');
    console.log('\nPlease add your FTP password to .env:');
    console.log(`FTP_HOST=${FTP_HOST}`);
    console.log(`FTP_PORT=${FTP_PORT}`);
    console.log(`FTP_USER=${FTP_USER}`);
    console.log('FTP_PASSWORD=your_hostinger_ftp_password');
    console.log(`FTP_REMOTE_DIR=${FTP_REMOTE_DIR}\n`);
    process.exit(1);
  }

  // 1. Build Frontend
  console.log('📦 Step 1: Building production frontend (npm run build)...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Frontend build succeeded.\n');
  } catch (err) {
    console.error('❌ Build failed. Aborting deployment.');
    process.exit(1);
  }

  // 2. Connect to FTP
  const client = new Client();
  client.ftp.verbose = false; // set to true if detailed debugging is needed

  try {
    console.log(`🔌 Step 2: Connecting to Hostinger FTP (${FTP_HOST}:${FTP_PORT}) as ${FTP_USER}...`);
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false // Standard FTP on port 21
    });
    console.log('✓ FTP Connection established successfully.\n');

    // 3. Ensure Remote Directory
    console.log(`📁 Step 3: Navigating to remote directory: /${FTP_REMOTE_DIR}...`);
    await client.ensureDir(FTP_REMOTE_DIR);
    console.log('✓ Remote directory ready.\n');

    // 4. Upload Files
    console.log('📤 Step 4: Uploading production files...');

    // 4.1 Upload dist/ directory
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      console.log('  → Uploading dist/ folder...');
      await client.uploadFromDir(distPath, 'dist');
      console.log('  ✓ dist/ uploaded successfully.');
    }

    // 4.2 Upload api/ directory
    const apiPath = path.join(process.cwd(), 'api');
    if (fs.existsSync(apiPath)) {
      console.log('  → Uploading api/ folder...');
      await client.uploadFromDir(apiPath, 'api');
      console.log('  ✓ api/ uploaded successfully.');
    }

    // 4.3 Upload data/ directory (if exists)
    const dataPath = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataPath)) {
      console.log('  → Uploading data/ folder...');
      await client.uploadFromDir(dataPath, 'data');
      console.log('  ✓ data/ uploaded successfully.');
    }

    // 4.4 Upload core server files
    const rootFiles = ['server.js', 'package.json', 'package-lock.json'];
    for (const file of rootFiles) {
      const localFile = path.join(process.cwd(), file);
      if (fs.existsSync(localFile)) {
        console.log(`  → Uploading ${file}...`);
        await client.uploadFrom(localFile, file);
        console.log(`  ✓ ${file} uploaded.`);
      }
    }

    // 4.5 Upload .env if present (warn user)
    const envFile = path.join(process.cwd(), '.env');
    if (fs.existsSync(envFile)) {
      console.log('  → Uploading .env configuration...');
      await client.uploadFrom(envFile, '.env');
      console.log('  ✓ .env uploaded.');
    }

    console.log('\n====================================================');
    console.log('✅ Deployment to Hostinger completed successfully!');
    console.log('🌐 Visit your site: https://kmagroup1.com');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ FTP Deployment Error:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
