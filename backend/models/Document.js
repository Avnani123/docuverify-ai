const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    // 🚀 FIXED: Added 'Rejected' to the allowed enum parameters so the status updates don't crash the server middleware
    enum: ['Pending', 'Verified', 'Rejected', 'Flagged'],
    // 🚀 FIXED: Changed the default initialization to 'Pending' so new uploads don't automatically jump straight to 'Verified'
    default: 'Pending'
  },
  confidenceScore: {
    type: String,
    default: '0%'
  },
  // 🚀 FIXED: Transformed into a dynamic Mixed Object block layout structure to properly digest and record the Gemini API parsing layers
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  extractedKeywords: [String],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);