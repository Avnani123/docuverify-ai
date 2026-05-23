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
  filePath: { 
    type: String, 
    required: true 
  },
  extractedText: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Document', DocumentSchema);