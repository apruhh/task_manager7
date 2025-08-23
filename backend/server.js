require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
// MySQL connection using .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});


// Routes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/notes', (req, res) => {
  const { title, description } = req.body;
  db.query('INSERT INTO notes (title, description) VALUES (?, ?)', [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Note added', id: result.insertId });
  });
});

app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  db.query('UPDATE notes SET title = ?, description = ? WHERE id = ?', [title, description, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Note updated' });
  });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Note deleted' });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
