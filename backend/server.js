const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'One23#@four',
  database: 'notes_app'
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
