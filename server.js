import app from './api/index.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 KMA Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Data Endpoint: http://localhost:${PORT}/api/data`);
  console.log(`===============================================`);
});
