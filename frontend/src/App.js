import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/notes');
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/notes/${editingId}`, form);
    } else 
    {
      await axios.post (`http://localhost:5000/notes`, form);
    }
    setForm({ title: '', description: '' });
    setEditingId(null);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, description: note.description });
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="container">
      <h1>📝 Personal Notes Manager</h1>
      <NoteForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        isEditing={!!editingId}
      />
      <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
