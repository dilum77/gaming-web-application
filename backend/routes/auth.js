const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
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

    const { username } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new user (simple username-only registration)
    user = new User({
      username: username.toLowerCase()
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully! 🎉',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          highScore: user.highScore,
          totalGamesPlayed: user.totalGamesPlayed
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required')
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

    const { username } = req.body;

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update last played
    user.lastPlayed = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful! 🐵',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          highScore: user.highScore,
          totalGamesPlayed: user.totalGamesPlayed
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          highScore: req.user.highScore,
          totalGamesPlayed: req.user.totalGamesPlayed,
          createdAt: req.user.createdAt,
          lastPlayed: req.user.lastPlayed
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

