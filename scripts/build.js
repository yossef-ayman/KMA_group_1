import fs from 'fs';
import { execSync } from 'child_process';

// If source files exist, run Vite build.
// If this is a production server with pre-built dist/, skip gracefully without error.
if (fs.existsSync('index.html') && fs.existsSync('src')) {
  console.log('🔨 Building frontend with Vite...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✓ Frontend build succeeded.');
  } catch (err) {
    console.error('❌ Vite build error:', err.message);
    process.exit(1);
  }
} else {
  console.log('====================================================');
  console.log('✓ Pre-built production assets detected in dist/');
  console.log('✓ Skipping Vite compilation on server.');
  console.log('====================================================');
  process.exit(0);
}
