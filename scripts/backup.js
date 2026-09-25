import fs from 'fs';
import path from 'path';

const BACKUP_ROOT = path.join(process.cwd(), 'backups');
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function runBackup() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(BACKUP_ROOT, `backup_${timestamp}`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`===============================================`);
  console.log(`📦 KMA Production Backup Starting...`);
  console.log(`📁 Backup Destination: ${backupDir}`);
  console.log(`===============================================`);

  let fileCount = 0;

  // 1. Backup JSON data files
  if (fs.existsSync(DATA_DIR)) {
    const dataFiles = fs.readdirSync(DATA_DIR);
    dataFiles.forEach((f) => {
      const src = path.join(DATA_DIR, f);
      const dest = path.join(backupDir, f);
      fs.copyFileSync(src, dest);
      fileCount++;
      console.log(`  ✓ Backed up data: ${f}`);
    });
  }

  // 2. Backup uploaded media files
  if (fs.existsSync(UPLOADS_DIR)) {
    const uploadsBackupDir = path.join(backupDir, 'uploads');
    fs.mkdirSync(uploadsBackupDir, { recursive: true });
    const uploadFiles = fs.readdirSync(UPLOADS_DIR);
    uploadFiles.forEach((f) => {
      const src = path.join(UPLOADS_DIR, f);
      const dest = path.join(uploadsBackupDir, f);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
        fileCount++;
      }
    });
    console.log(`  ✓ Backed up ${uploadFiles.length} media upload(s)`);
  }

  // 3. Write metadata manifest
  const manifest = {
    backupTimestamp: now.toISOString(),
    filesBackedUp: fileCount,
    nodeEnv: process.env.NODE_ENV || 'production',
    appName: 'kma-wedding-media-production'
  };
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`===============================================`);
  console.log(`✅ Backup completed successfully (${fileCount} files)`);
  console.log(`===============================================`);
}

runBackup();
