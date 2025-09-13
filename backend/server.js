require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { router: authRouter, authenticateToken, setDatabase } = require('./auth');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);
  next();
});

// MySQL connection with fallback values
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'notes_app'
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.error('Please check your database configuration in .env file');
    console.error('Required environment variables:');
    console.error('- DB_HOST (default: localhost)');
    console.error('- DB_USER (default: root)');
    console.error('- DB_PASSWORD (default: empty)');
    console.error('- DB_NAME (default: notes_app)');
    return;
  }
  console.log('Connected to MySQL database!');
  console.log(`Database: ${process.env.DB_NAME || 'notes_app'}`);
  console.log('Database state:', db.state);
  
  // Set database connection in auth module
  setDatabase(db);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db.state === 'authenticated' ? 'connected' : 'disconnected'
  });
});

// Test endpoint to verify routing is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/signup, /api/login, /api/profile',
      notes: '/notes (protected)',
      health: '/health'
    }
  });
});

// Authentication routes (no authentication required)
app.use('/api', authRouter);

// Add logging to confirm routes are registered
console.log('📝 Authentication routes registered at /api/*');
console.log('📝 Available auth endpoints: /api/signup, /api/login, /api/profile');

// Debug middleware to log all requests after auth routes
app.use((req, res, next) => {
  console.log('🔍 AFTER AUTH ROUTES - Request path:', req.path);
  console.log('🔍 Request method:', req.method);
  console.log('🔍 Request URL:', req.url);
  next();
});

// Protected routes - require valid JWT token
// All notes routes now require authentication
app.get('/notes', authenticateToken, (req, res) => {
  // You can now access user info via req.user
  const userId = req.user.userId;
  
  db.query('SELECT * FROM notes WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    res.json(results);
  });
});

app.post('/notes', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;
  
  // Validate input
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  db.query(
    'INSERT INTO notes (title, description, user_id) VALUES (?, ?, ?)', 
    [title, description, userId], 
    (err, result) => {
      if (err) {
        console.error('Error creating note:', err);
        return res.status(500).json({ error: 'Failed to create note' });
      }
      res.json({ message: 'Note added', id: result.insertId });
    }
  );
});

app.put('/notes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.userId;
  
  // Validate input
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  // Update only if the note belongs to the authenticated user
  db.query(
    'UPDATE notes SET title = ?, description = ? WHERE id = ? AND user_id = ?', 
    [title, description, id, userId], 
    (err, result) => {
      if (err) {
        console.error('Error updating note:', err);
        return res.status(500).json({ error: 'Failed to update note' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Note not found or access denied' });
      }
      res.json({ message: 'Note updated' });
    }
  );
});

app.delete('/notes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Delete only if the note belongs to the authenticated user
  db.query(
    'DELETE FROM notes WHERE id = ? AND user_id = ?', 
    [id, userId], 
    (err, result) => {
      if (err) {
        console.error('Error deleting note:', err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Note not found or access denied' });
      }
      res.json({ message: 'Note deleted' });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for undefined routes - using explicit catch-all pattern for Express 5
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
  console.log('📝 Authentication endpoints available at /api/signup and /api/login');
  console.log('🔍 Health check available at /health');
  console.log('🌐 CORS enabled for frontend at http://localhost:3000');
});

