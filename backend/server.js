const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. Core Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// Serve static assets from uploads folder (helps view files if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docuverify';
mongoose.connect(mongoURI)
  .then(() => console.log('🛡️ Secure MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: Make sure your MongoDB service is running locally, or verify your Atlas URI string in .env');
  });

// 3. Base Checking Route
app.get('/', (req, res) => {
  res.json({ message: 'DocuVerify AI Backend API running smoothly.' });
});

// 4. Server Listener Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server processing requests seamlessly on port ${PORT}`);
});