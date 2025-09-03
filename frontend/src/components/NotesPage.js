import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { notesAPI } from '../utils/api';
import './NotesPage.css';

const NotesPage = ({ onLogout }) => {
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

  // Debug logging for onLogout prop
  useEffect(() => {
    console.log('🔍 NotesPage received onLogout prop:', !!onLogout);
  }, [onLogout]);

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
    console.log('🚪 NotesPage handleLogout called');
    
    // Call parent's logout handler to update App.js state
    if (onLogout) {
      console.log('🔄 Calling parent onLogout callback');
      onLogout();
    } else {
      console.warn('⚠️ onLogout prop not provided to NotesPage');
    }
    
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🗑️ localStorage cleared');
    
    // Redirect to login page
    console.log('🔄 Navigating to /login');
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
