import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

// src/components/LoginForm.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/user/signin', formData);
    console.log('Login successful:', response.data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', formData.username); // Store username in local storage
    alert('User logged in successfully');
    setErrorMessage(''); // Clear any previous error messages
    navigate('/dashboard'); // Redirect to the dashboard
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    setErrorMessage('Login failed: Invalid username or password'); // Set error message
  }
};


  const handleSignUpRedirect = () => {
    navigate('/user/signup');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button">Log In</button>
        <div className="signup-prompt">
          <p>
            Don't have an account? 
            <span className="signup-link" onClick={handleSignUpRedirect}> Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
