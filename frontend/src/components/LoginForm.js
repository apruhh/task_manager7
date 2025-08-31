import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './AuthForms.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with username:', formData.username);
      
      const response = await authAPI.login(formData);
      console.log('Login response received:', response.data);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Token stored in localStorage');
      
      // Call the onLogin callback to update parent state
      if (onLogin) {
        onLogin(response.data.token, response.data.user);
      }
      
      // Redirect to the main notes page
      navigate('/');
      
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.error || `Server error: ${err.response.status}`;
        setError(errorMessage);
        console.error('Server error response:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check if the backend is running.');
        console.error('No response received:', err.request);
      } else {
        // Something else happened
        setError('Login failed. Please try again.');
        console.error('Login error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Login</h2>
        <p className="auth-subtitle">Welcome back! Please sign in to your account.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
