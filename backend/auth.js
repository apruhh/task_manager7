const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const router = express.Router();

// Get database connection from server.js
let db;

// Function to set database connection (will be called from server.js)
const setDatabase = (database) => {
  db = database;
  console.log('🔧 Database connection set in auth module, state:', db?.state);
};

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to check database connection
const checkDatabaseConnection = (res) => {
  if (!db) {
    console.error('Database not connected - db is null');
    return res.status(500).json({ error: 'Database connection not available' });
  }
  
  // Check if database is connected (MySQL2 connection state)
  // MySQL2 states: 'disconnected', 'connected', 'authenticated', 'protocol_error'
  if (db.state === 'disconnected' || db.state === 'protocol_error') {
    console.error('Database connection state:', db.state);
    return res.status(500).json({ error: 'Database connection not available' });
  }
  
  console.log('✅ Database connection check passed, state:', db.state);
  return true;
};

/**
 * POST /api/signup - Register a new user
 * Body: { username, password }
 */
router.post('/signup', async (req, res) => {
  console.log('🔐 SIGNUP ROUTE HIT - /api/signup');
  try {
    console.log('Signup request received:', { username: req.body.username, hasPassword: !!req.body.password });
    
    // Check database connection
    if (!checkDatabaseConnection(res)) return;
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Signup validation failed: missing username or password');
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (password.length < 6) {
      console.log('Signup validation failed: password too short');
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    db.query('SELECT id FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Database error during user check:', err);
        return res.status(500).json({ error: 'Database error occurred' });
      }

      if (results.length > 0) {
        console.log('Signup failed: username already exists');
        return res.status(409).json({ error: 'Username already exists' });
      }

      try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        db.query(
          'INSERT INTO users (username, password_hash) VALUES (?, ?)',
          [username, passwordHash],
          (err, result) => {
            if (err) {
              console.error('Database error during user creation:', err);
              return res.status(500).json({ error: 'Failed to create user' });
            }

            console.log('User created successfully:', { userId: result.insertId, username });
            res.status(201).json({ 
              message: 'User created successfully',
              userId: result.insertId 
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({ error: 'Failed to process password' });
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/login - Authenticate user and return JWT token
 * Body: { username, password }
 */
router.post('/login', (req, res) => {
  console.log('🔐 LOGIN ROUTE HIT - /api/login');
  try {
    console.log('Login request received:', { username: req.body.username, hasPassword: !!req.body.password });
    
    // Check database connection
    if (!checkDatabaseConnection(res)) return;
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Login validation failed: missing username or password');
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user by username
    db.query(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          console.error('Database error during login:', err);
          return res.status(500).json({ error: 'Database error occurred' });
        }

        if (results.length === 0) {
          console.log('Login failed: user not found');
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        console.log('User found, verifying password');

        try {
          // Compare password with hash
          const isPasswordValid = await bcrypt.compare(password, user.password_hash);
          
          if (!isPasswordValid) {
            console.log('Login failed: invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { 
              userId: user.id, 
              username: user.username 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          console.log('Login successful:', { userId: user.id, username: user.username });
          res.json({
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              username: user.username
            }
          });
        } catch (compareError) {
          console.error('Password comparison error:', compareError);
          res.status(500).json({ error: 'Authentication error occurred' });
        }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Middleware to authenticate JWT tokens
 * Use this to protect routes that require authentication
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('Authentication failed: no token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Authentication failed: invalid token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    console.log('Token verified for user:', { userId: user.userId, username: user.username });
    // Add user info to request object
    req.user = user;
    next();
  });
};

/**
 * GET /api/profile - Get current user profile (protected route example)
 * Requires valid JWT token in Authorization header
 */
router.get('/profile', authenticateToken, (req, res) => {
  console.log('Profile request for user:', { userId: req.user.userId, username: req.user.username });
  res.json({
    message: 'Profile accessed successfully',
    user: {
      id: req.user.userId,
      username: req.user.username
    }
  });
});

module.exports = { router, authenticateToken, setDatabase };

