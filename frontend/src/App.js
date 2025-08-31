import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import NotesPage from './components/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }
    
    setLoading(false);
  }, []);

  // Handle successful login
  const handleLogin = (token, userInfo) => {
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginForm onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <SignupForm onLogin={handleLogin} />
            } 
          />
          
          {/* Protected route - main notes page */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <NotesPage onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route - redirect to login if not authenticated, or home if authenticated */}
          <Route 
            path="*" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
