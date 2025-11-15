// MongoDB Upload Model - stores user uploads and analysis results
import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  // Store image as base64 string (for images < 1MB)
  imageData: {
    type: String, // base64 encoded
  },
  extractedText: {
    type: String,
    required: true,
  },
  analysis: {
    summary: String,
    suggestions: [String],
    hashtags: [String],
    bestTimeToPost: String,
    toneRecommendations: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
UploadSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
