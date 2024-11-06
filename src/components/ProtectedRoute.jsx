import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or use another authentication method

  // If token is not found, redirect to the absolute path of /user/signin
  if (!token) {
    return <Navigate to="/user/signin" />; // Use absolute path
  }

  // If token is found, allow access to the protected route
  return children;
};

export default ProtectedRoute;
