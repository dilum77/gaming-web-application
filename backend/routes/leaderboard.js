const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const User = require('../models/User');
const auth = require('../middleware/auth');

//  POST /api/leaderboard/score
//  Submit a new score
//  Private
router.post('/score', [
  auth,
  body('score').isInt({ min: 0 }).withMessage('Score must be a positive number'),
  body('level').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid level'),
  body('timeRemaining').optional().isInt({ min: 0 }),
  body('puzzlesSolved').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { score, level, timeRemaining, puzzlesSolved } = req.body;

    // Create new score entry
    const newScore = new Score({
      user: req.userId,
      username: req.user.username,
      score,
      level,
      timeRemaining: timeRemaining || 0,
      puzzlesSolved: puzzlesSolved || 1
    });

    await newScore.save();

    // Update user's high score if this is better
    const user = await User.findById(req.userId);
    user.updateHighScore(score);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Score submitted successfully! 🏆',
      data: {
        score: newScore,
        isNewHighScore: score === user.highScore
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting score'
    });
  }
});

// @route   GET /api/leaderboard/top
// @desc    Get top scores (leaderboard)
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const level = req.query.level; // Optional: filter by level

    let query = {};
    if (level && ['Easy', 'Medium', 'Hard'].includes(level)) {
      query.level = level;
    }

    const topScores = await Score.find(query)
      .sort({ score: -1, playedAt: -1 })
      .limit(limit)
      .select('username score level playedAt timeRemaining puzzlesSolved')
      .lean();

    res.json({
      success: true,
      data: {
        leaderboard: topScores,
        count: topScores.length
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// @route   GET /api/leaderboard/user/:userId
// @desc    Get user's score history
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const userScores = await Score.find({ user: userId })
      .sort({ playedAt: -1 })
      .limit(limit)
      .select('score level playedAt timeRemaining puzzlesSolved')
      .lean();

    res.json({
      success: true,
      data: {
        scores: userScores,
        count: userScores.length
      }
    });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user scores'
    });
  }
});

// @route   GET /api/leaderboard/my-scores
// @desc    Get current user's score history
// @access  Private
router.get('/my-scores', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const myScores = await Score.find({ user: req.userId })
      .sort({ playedAt: -1 })
      .limit(limit)
      .select('score level playedAt timeRemaining puzzlesSolved')
      .lean();

    res.json({
      success: true,
      data: {
        scores: myScores,
        count: myScores.length
      }
    });
  } catch (error) {
    console.error('Get my scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your scores'
    });
  }
});

// @route   GET /api/leaderboard/stats
// @desc    Get leaderboard statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalPlayers = await User.countDocuments();
    const totalGames = await Score.countDocuments();
    const topPlayer = await User.findOne().sort({ highScore: -1 }).select('username highScore');
    
    const avgScoreResult = await Score.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    res.json({
      success: true,
      data: {
        totalPlayers,
        totalGames,
        avgScore,
        topPlayer: topPlayer ? {
          username: topPlayer.username,
          highScore: topPlayer.highScore
        } : null
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
});

module.exports = router;

