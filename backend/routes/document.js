const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `DOC-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Refactored upload endpoint
router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // 1. This is where your AI/Extraction logic will live
        // 2. Save the document metadata into your MongoDB collection here

        res.status(200).json({
            docId: req.file.filename.split('.')[0],
            fileName: req.file.originalname,
            status: 'Verified'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PUT /api/documents/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'Verified' or 'Flagged'
    
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!updatedDoc) return res.status(404).json({ message: 'Document not found' });
    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
