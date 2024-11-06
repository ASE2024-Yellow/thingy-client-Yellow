import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../styles/SignupForm.css';  // Import the CSS file

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    transportType: 'other', // default option
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/user/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      
      setMessage(`User ${response.data.username} created successfully!`);
      window.alert('User signed up successfully!');  // Show alert
      navigate('/user/signin');  // Redirect to the sign-in page
    } catch (error) {
      console.error(error);
      setMessage('Error creating user. Please try again.');
    }
  };

  // Handle login redirection
  const handleLoginRedirect = () => {
    navigate('/user/signin');  // Redirect to the login page
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Your Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Transport Type:</label>
          <select
            name="transportType"
            value={formData.transportType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="bike">Bike</option>
            <option value="wheelchair">Wheelchair</option>
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="signup-btn">Sign Up</button>
          <button type="button" className="login-btn" onClick={handleLoginRedirect}>Login</button>
        </div>
      </form>
      {message && <p className="signup-message">{message}</p>}
    </div>
  );
};

export default SignupForm;
