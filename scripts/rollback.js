import fs from 'fs';
import path from 'path';

const BACKUP_ROOT = path.join(process.cwd(), 'backups');
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function runRollback() {
  if (!fs.existsSync(BACKUP_ROOT)) {
    console.error('❌ No backups directory found. Nothing to rollback.');
    process.exit(1);
  }

  const backups = fs
    .readdirSync(BACKUP_ROOT)
    .filter((f) => f.startsWith('backup_'))
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.error('❌ No backup archives found in backups directory.');
    process.exit(1);
  }

  // Use specified target backup folder from CLI argument or default to the most recent one
  const targetBackupName = process.argv[2] || backups[0];
  const targetBackupDir = path.join(BACKUP_ROOT, targetBackupName);

  if (!fs.existsSync(targetBackupDir)) {
    console.error(`❌ Target backup folder not found: ${targetBackupDir}`);
    process.exit(1);
  }

  console.log(`===============================================`);
  console.log(`🔄 KMA Rollback Starting...`);
  console.log(`📁 Restoring from: ${targetBackupName}`);
  console.log(`===============================================`);

  let restoredCount = 0;

  // 1. Restore JSON files
  const backupFiles = fs.readdirSync(targetBackupDir);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  backupFiles.forEach((file) => {
    if (file.endsWith('.json') && file !== 'manifest.json') {
      const src = path.join(targetBackupDir, file);
      const dest = path.join(DATA_DIR, file);
      fs.copyFileSync(src, dest);
      restoredCount++;
      console.log(`  ✓ Restored data file: ${file}`);
    }
  });

  // 2. Restore uploads
  const uploadsBackupDir = path.join(targetBackupDir, 'uploads');
  if (fs.existsSync(uploadsBackupDir)) {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const uploadFiles = fs.readdirSync(uploadsBackupDir);
    uploadFiles.forEach((file) => {
      const src = path.join(uploadsBackupDir, file);
      const dest = path.join(UPLOADS_DIR, file);
      fs.copyFileSync(src, dest);
      restoredCount++;
    });
    console.log(`  ✓ Restored ${uploadFiles.length} uploaded media file(s)`);
  }

  console.log(`===============================================`);
  console.log(`✅ Rollback to ${targetBackupName} completed successfully (${restoredCount} items)`);
  console.log(`===============================================`);
}

runRollback();
