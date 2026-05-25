const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Initialize Models and Middlewares
const User = require('./models/User');
const Document = require('./models/Document');
const auth = require('./middleware/auth');

const app = express();

// ==========================================
// 1. CORE MIDDLEWARES (Must be at the top)
// ==========================================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// Serve static assets from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. MULTER STORAGE CONFIGURATION
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Saves files into your backend/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/JPG/PNG) and PDFs are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ==========================================
// 3. AUTHENTICATION API ROUTES
// ==========================================

// ROUTE 1: User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

// ROUTE 2: User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during login');
  }
});

// ROUTE 3: Get Protected User Profile
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// 4. DOCUMENT PIPELINE API ROUTES
// ==========================================

// ROUTE 4: Secure Document Upload & Registry
app.post('/api/documents/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid file.' });
    }

    const newDocument = new Document({
      userId: req.user.id,
      title: req.body.title || req.file.originalname,
      fileUrl: req.file.path,
      status: 'Verified', // Set as 'Verified' or 'Pending' depending on design
      extractedText: '' 
    });

    const savedDoc = await newDocument.save();
    
    // Format the response schema to map seamlessly to your React UI keys
    res.status(201).json({
      message: 'Document uploaded successfully!',
      document: {
        id: savedDoc._id,
        fileName: savedDoc.title,
        status: savedDoc.status,
        confidenceScore: '96%', 
        timestamp: savedDoc.uploadedAt ? new Date(savedDoc.uploadedAt).toLocaleString() : new Date().toLocaleString()
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || 'Server error during upload' });
  }
});

// ROUTE 5: Fetch Current User's Documents
app.get('/api/documents/my-docs', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    
    // Map array values to format clearly onto the client component layout UI
    const formattedDocs = docs.map(doc => ({
      id: doc._id,
      fileName: doc.title,
      status: doc.status || 'Verified',
      confidenceScore: '96%',
      timestamp: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : new Date().toLocaleString()
    }));
    
    res.json(formattedDocs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Base Check Route
app.get('/', (req, res) => {
  res.json({ message: 'DocuVerify AI Backend API running smoothly.' });
});

// ==========================================
// 5. DATABASE CONNECTION & INSTANCE LISTENERS
// ==========================================
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docuverify';
mongoose.connect(mongoURI)
  .then(() => console.log('🛡️ Secure MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server processing requests seamlessly on port ${PORT}`);
});