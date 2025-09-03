import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated by looking for token in localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
