import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/signin', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', formData.username);
      alert('User logged in successfully');
      setErrorMessage('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setErrorMessage('Login failed: Invalid username or password');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/user/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-yellow-500">
      <div className="bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">Sign In</h2>
          {errorMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded flex items-center" role="alert">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg transition duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-yellow-300">
            Don't have an account?{' '}
            <span
              onClick={handleSignUpRedirect}
              className="text-yellow-500 hover:text-yellow-400 cursor-pointer font-semibold transition duration-200"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;