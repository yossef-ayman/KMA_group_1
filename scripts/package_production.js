/**
 * KMA Wedding & Media Production
 * Hostinger Production Zip Packager
 *
 * Prepares and compresses only the production files required by Hostinger:
 *   - dist/ (compiled frontend)
 *   - api/ (backend routes & MySQL database layer)
 *   - data/ (fallback data)
 *   - server.js (production Express server)
 *   - package.json & package-lock.json
 *   - .env.example
 *
 * Usage:
 *   npm run package:prod
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const STAGING_DIR = path.join(process.cwd(), '_temp_deploy');
const OUTPUT_ZIP = path.join(process.cwd(), 'deploy_hostinger.zip');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function packageApp() {
  console.log('====================================================');
  console.log('📦 Packaging KMA Production Bundle for Hostinger...');
  console.log('====================================================\n');

  // 1. Build Frontend
  console.log('🔨 Step 1: Running frontend build (npm run build)...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✓ Build successful.\n');
  } catch (e) {
    console.error('❌ Build failed. Aborting package.');
    process.exit(1);
  }

  // 2. Prepare Clean Staging Directory
  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  if (fs.existsSync(OUTPUT_ZIP)) {
    fs.unlinkSync(OUTPUT_ZIP);
  }

  console.log('📁 Step 2: Gathering production files...');
  copyRecursive(path.join(process.cwd(), 'dist'), path.join(STAGING_DIR, 'dist'));
  copyRecursive(path.join(process.cwd(), 'api'), path.join(STAGING_DIR, 'api'));
  if (fs.existsSync(path.join(process.cwd(), 'data'))) {
    copyRecursive(path.join(process.cwd(), 'data'), path.join(STAGING_DIR, 'data'));
  }

  // Ensure scripts/build.js is copied
  const scriptsDir = path.join(STAGING_DIR, 'scripts');
  if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
  if (fs.existsSync(path.join(process.cwd(), 'scripts', 'build.js'))) {
    fs.copyFileSync(
      path.join(process.cwd(), 'scripts', 'build.js'),
      path.join(scriptsDir, 'build.js')
    );
  }

  const rootFiles = ['server.js', 'package.json', 'package-lock.json', '.env.example'];
  for (const f of rootFiles) {
    const full = path.join(process.cwd(), f);
    if (fs.existsSync(full)) {
      fs.copyFileSync(full, path.join(STAGING_DIR, f));
    }
  }
  console.log('✓ Files staged in _temp_deploy/\n');

  // 3. Compress to Zip using PowerShell Compress-Archive
  console.log('🗜️  Step 3: Creating deploy_hostinger.zip...');
  try {
    execSync(
      `powershell -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${OUTPUT_ZIP}' -Force"`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    console.error('❌ Zip compression failed:', err.message);
    process.exit(1);
  } finally {
    // Cleanup staging folder
    if (fs.existsSync(STAGING_DIR)) {
      fs.rmSync(STAGING_DIR, { recursive: true, force: true });
    }
  }

  const stat = fs.statSync(OUTPUT_ZIP);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);

  console.log('\n====================================================');
  console.log(`✅ Production Zip Ready: deploy_hostinger.zip`);
  console.log(`📊 Total Size: ${sizeMb} MB`);
  console.log('====================================================');
  console.log('\n🚀 How to deploy on Hostinger in 1 minute:');
  console.log('  1. Open Hostinger hPanel -> File Manager (مدير الملفات).');
  console.log('  2. Open the "public_html" folder.');
  console.log('  3. Upload "deploy_hostinger.zip".');
  console.log('  4. Right click -> Extract (استخراج هنا).');
  console.log('  5. In hPanel -> Node.js, click "Restart Application".');
  console.log('  6. Your website is 100% updated and working!\n');
}

packageApp();
