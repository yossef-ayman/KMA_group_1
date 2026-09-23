import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Persistent local file paths for Node server (fallback when MONGODB_URI is not set)
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'saved_portfolio.json');
const LOCAL_BOOKINGS_FILE = path.join(LOCAL_DATA_DIR, 'saved_bookings.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
  } catch (e) {}
}

function loadLocalFile(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return fallback;
}

function saveLocalFile(filePath, data) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

// In-Memory / File Storage Fallback
let memoryPortfolioData = loadLocalFile(LOCAL_DATA_FILE, null);
let memoryPasscode = process.env.ADMIN_PASSCODE || 'kma2026';
let memoryBookings = loadLocalFile(LOCAL_BOOKINGS_FILE, []);

// Optional MongoDB setup
let isMongoConnected = false;

const PortfolioModel = mongoose.models.Portfolio || mongoose.model(
  'Portfolio',
  new mongoose.Schema({
    docId: { type: String, default: 'kma_portfolio_main', unique: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now }
  })
);

const BookingModel = mongoose.models.Booking || mongoose.model(
  'Booking',
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    eventType: { type: String, default: 'wedding' },
    eventDate: { type: String, default: '' },
    location: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, default: 'new' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  })
);

const SettingsModel = mongoose.models.Settings || mongoose.model(
  'Settings',
  new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true }
  })
);

async function initDB() {
  if (isMongoConnected) return true;
  if (!process.env.MONGODB_URI) return false;

  try {
    if (mongoose.connection.readyState === 1) {
      isMongoConnected = true;
      return true;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    isMongoConnected = true;
    console.log('[Backend] Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    console.warn('[Backend] MongoDB connection skipped/failed:', err.message);
    isMongoConnected = false;
    return false;
  }
}

// Middleware to ensure DB connection attempt
app.use(async (req, res, next) => {
  await initDB();
  next();
});

// ---------------------------------------------
// Health Check Route
// ---------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'KMA Wedding & Media Production API',
    mode: isMongoConnected ? 'mongodb-atlas' : 'memory-store',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ---------------------------------------------
// Portfolio Data Routes
// ---------------------------------------------
// GET /api/data -> Get current portfolio content
app.get('/api/data', async (req, res) => {
  try {
    if (isMongoConnected) {
      const doc = await PortfolioModel.findOne({ docId: 'kma_portfolio_main' });
      if (doc && doc.data) {
        return res.json({ success: true, data: doc.data, source: 'mongodb' });
      }
    }
    // Fallback to memory
    return res.json({
      success: true,
      data: memoryPortfolioData,
      source: 'memory'
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/data -> Save portfolio content
app.post('/api/data', async (req, res) => {
  try {
    const incomingData = req.body;
    if (!incomingData || typeof incomingData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    memoryPortfolioData = incomingData;
    saveLocalFile(LOCAL_DATA_FILE, incomingData);

    if (isMongoConnected) {
      await PortfolioModel.findOneAndUpdate(
        { docId: 'kma_portfolio_main' },
        { data: incomingData, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Portfolio data updated successfully.',
      source: isMongoConnected ? 'mongodb' : 'file-memory',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------
// Event Bookings Routes
// ---------------------------------------------
// GET /api/bookings -> Get all visitor bookings
app.get('/api/bookings', async (req, res) => {
  try {
    if (isMongoConnected) {
      const list = await BookingModel.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, bookings: list, source: 'mongodb' });
    }
    return res.json({ success: true, bookings: memoryBookings, source: 'file-memory' });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/bookings -> Add a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, eventType, eventDate, location, message } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    const newBooking = {
      id: req.body.id || `book-${Date.now()}`,
      name,
      phone: phone || '',
      email: email || '',
      eventType: eventType || 'wedding',
      eventDate: eventDate || '',
      location: location || '',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    memoryBookings = [newBooking, ...memoryBookings];
    saveLocalFile(LOCAL_BOOKINGS_FILE, memoryBookings);

    if (isMongoConnected) {
      await BookingModel.create(newBooking);
    }

    return res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Booking submitted successfully.'
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/bookings/:id -> Update booking status
app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    memoryBookings = memoryBookings.map((b) => (b.id === id ? { ...b, status } : b));
    saveLocalFile(LOCAL_BOOKINGS_FILE, memoryBookings);

    if (isMongoConnected) {
      await BookingModel.findOneAndUpdate({ id }, { status });
    }

    return res.json({ success: true, message: 'Booking status updated.' });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/bookings/:id -> Remove booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    memoryBookings = memoryBookings.filter((b) => b.id !== id);
    saveLocalFile(LOCAL_BOOKINGS_FILE, memoryBookings);

    if (isMongoConnected) {
      await BookingModel.deleteOne({ id });
    }

    return res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------
// Admin Authentication Routes
// ---------------------------------------------
// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { passcode } = req.body;
    let expectedPasscode = memoryPasscode;

    if (isMongoConnected) {
      const setting = await SettingsModel.findOne({ key: 'admin_passcode' });
      if (setting && setting.value) {
        expectedPasscode = setting.value;
      }
    }

    if (passcode === expectedPasscode) {
      return res.json({
        success: true,
        authenticated: true,
        message: 'Admin authenticated successfully.'
      });
    }

    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'Invalid passcode.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/change-passcode
app.post('/api/auth/change-passcode', async (req, res) => {
  try {
    const { currentPasscode, newPasscode } = req.body;
    let expectedPasscode = memoryPasscode;

    if (isMongoConnected) {
      const setting = await SettingsModel.findOne({ key: 'admin_passcode' });
      if (setting && setting.value) {
        expectedPasscode = setting.value;
      }
    }

    if (currentPasscode !== expectedPasscode) {
      return res.status(401).json({ success: false, message: 'Current passcode is incorrect.' });
    }

    if (!newPasscode || newPasscode.length < 4) {
      return res.status(400).json({ success: false, message: 'New passcode must be at least 4 chars.' });
    }

    memoryPasscode = newPasscode;

    if (isMongoConnected) {
      await SettingsModel.findOneAndUpdate(
        { key: 'admin_passcode' },
        { value: newPasscode },
        { upsert: true }
      );
    }

    return res.json({ success: true, message: 'Passcode changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export default for Vercel Serverless Function
export default app;
