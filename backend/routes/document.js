// backend/routes/documents.js
const express = require('express');
const router = express.Router();

// Simulated MongoDB Document Schema array for local verification storage
// (If using Mongoose, change this to a model save)
let mockDatabaseLogs = [];

router.post('/upload', (req, res) => {
  try {
    const { fileName, fileSize, userId, userName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "No file cataloged." });
    }

    // Creating a mock verification entry simulating OCR engine behavior
    const newDoc = {
      id: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
      fileName,
      fileSize: (fileSize / 1024).toFixed(1) + ' KB',
      submittedBy: userName || 'Anonymous Submitter',
      timestamp: new Date().toLocaleString(),
      status: Math.random() > 0.15 ? 'Verified' : 'Flagged', // Simulating an authentication algorithm
      confidenceScore: Math.floor(75 + Math.random() * 24) + '%'
    };

    mockDatabaseLogs.unshift(newDoc); // Save to the top of our log pipeline

    res.status(201).json({
      message: "Document pipeline processing completed successfully.",
      document: newDoc,
      allLogs: mockDatabaseLogs
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Processing Error." });
  }
});

// Fetch all pipeline entries for the System Auditor dashboard
router.get('/logs', (req, res) => {
  res.json(mockDatabaseLogs);
});

module.exports = router;