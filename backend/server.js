const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. Core Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const auth = require('./middleware/auth');

// ==========================================
// ROUTE 1: User Registration (Sign Up)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'user' // Default to regular user if not specified
        });

        // Encrypt password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return JSON Web Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during registration');
    }
});

// ==========================================
// ROUTE 2: User Login (Sign In)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify email exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Compare plain password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Generate Token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
});

// ==========================================
// ROUTE 3: Get User Data (Protected Route Example)
// ==========================================
app.get('/api/auth/user', auth, async (req, res) => {
    try {
        // Fetch user data minus the password string
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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
// Replace the app.listen block at the very bottom of backend/server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server processing requests seamlessly on port ${PORT}`);
});
const multer = require('multer');
const Document = require('./models/Document');

// 1. Configure how files are saved locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Saves files into your backend/uploads folder
    },
    filename: (req, file, cb) => {
        // Appends timestamp to original name to avoid duplicates (e.g., 1716670000-transcript.png)
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 2. Set up file filtering (Only accept common document types)
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
    limits: { fileSize: 5 * 1024 * 1024 } // Limit files to 5MB max
});
// ==========================================
// ROUTE 4: Secure Document Upload & Registry
// ==========================================
app.post('/api/documents/upload', auth, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a valid file.' });
        }

        // Create a new entry in your MongoDB cluster
        const newDocument = new Document({
            userId: req.user.id, // Extracted from JWT token by auth middleware
            title: req.body.title || req.file.originalname,
            fileUrl: req.file.path, // Path to the file stored inside backend/uploads/
            status: 'pending',
            extractedText: '' // Left blank for Phase 2: Day 4 (OCR processing)
        });

        const savedDoc = await newDocument.save();
        
        res.status(201).json({
            message: 'Document uploaded successfully!',
            document: savedDoc
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error during upload' });
    }
});

// ==========================================
// ROUTE 5: Fetch Current User's Documents
// ==========================================
app.get('/api/documents/my-docs', auth, async (req, res) => {
    try {
        // Find documents belonging explicitly to the logged-in user
        const docs = await Document.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
        res.json(docs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});