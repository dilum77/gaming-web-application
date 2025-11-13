const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  timeRemaining: {
    type: Number,
    default: 0
  },
  puzzlesSolved: {
    type: Number,
    default: 1
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for leaderboard queries
scoreSchema.index({ score: -1, playedAt: -1 });
scoreSchema.index({ user: 1, score: -1 });
scoreSchema.index({ level: 1, score: -1 });

module.exports = mongoose.model('Score', scoreSchema);

