const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/academic_portal';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Common causes and actionable guidance:
    if (err && err.message && err.message.includes('querySrv')) {
      console.error('SRV DNS lookup failed (querySrv). If you are using MongoDB Atlas, please check:');
      console.error('- Your Atlas Network Access allows connections from your IP (or set 0.0.0.0/0 for testing).');
      console.error('- Your MONGO_URI includes a database name and the correct query params (e.g. retryWrites=true&w=majority).');
      console.error('- If your password contains special characters, URL-encode it.');
      console.error('- Your environment has DNS resolution for SRV records (some networks block DNS queries).');
    }
    if (err && (err.code === 'ECONNREFUSED' || (err.message && err.message.includes('ECONNREFUSED')))) {
      console.error('Connection refused. Ensure the database endpoint is reachable and accepts connections.');
    }
  });

// basic ping
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

// mount routes
try {
  const authRoutes = require('./routes/authRoutes');
  const subjectRoutes = require('./routes/subjectRoutes');
  const fileRoutes = require('./routes/fileRoutes');
  const notificationRoutes = require('./routes/notificationRoutes');
  const noticeRoutes = require('./routes/noticeRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const eventRoutes = require('./routes/eventRoutes');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/notices', noticeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/admin', adminRoutes);
} catch (e) {
  console.error('Error mounting routes:', e);
}

// Health check
app.get('/api/health', (req, res) => res.json({ message: '🚀 Server is running' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
