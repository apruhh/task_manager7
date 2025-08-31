import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { notesAPI } from '../utils/api';
import './NotesPage.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user info from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getAll();
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // API utility will handle auth errors automatically
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await notesAPI.update(editingId, form);
      } else {
        await notesAPI.create(form);
      }
      
      setForm({ title: '', description: '' });
      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      // API utility will handle auth errors automatically
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, description: note.description });
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    try {
      await notesAPI.delete(id);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      // API utility will handle auth errors automatically
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="notes-page">
      <header className="notes-header">
        <div className="header-content">
          <h1>📝 Personal Notes Manager</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="notes-main">
        <NoteForm
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          isEditing={!!editingId}
        />
        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default NotesPage;
