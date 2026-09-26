import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {}
}

// Serve uploaded media statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve static frontend assets from Vite dist/ build if available
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  // Explicit 404 for missing static assets inside /assets
  app.use('/assets', (req, res) => {
    res.status(404).type('text/plain').send('Asset not found');
  });

  // SPA fallback: only serve dist/index.html for page navigation routes (no file extension)
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/uploads') &&
      !path.extname(req.path)
    ) {
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
    next();
  });
}

// Explicit JSON 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 KMA Production Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Data Endpoint: http://localhost:${PORT}/api/data`);
  console.log(`📁 Uploads Directory: ${UPLOADS_DIR}`);
  if (fs.existsSync(DIST_DIR)) {
    console.log(`🌐 Serving Frontend from: ${DIST_DIR}`);
  } else {
    console.log(`⚠️  Vite build directory (dist/) not found. Run 'npm run build' first.`);
  }
  console.log(`===============================================`);
});

export default app;
