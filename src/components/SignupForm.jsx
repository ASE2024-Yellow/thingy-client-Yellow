import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    transportType: 'other',
  });
  const [message, setMessage] = useState('');
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
      const response = await axios.post('http://localhost:3000/user/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage(`User ${response.data.username} created successfully!`);
      window.alert('User signed up successfully!');
      navigate('/user/signin');
    } catch (error) {
      console.error(error);
      setMessage('Error creating user. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/user/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-yellow-500 p-6">
      <div className="bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-yellow-300">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-yellow-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="transportType" className="block text-sm font-medium text-yellow-300">Transport Type</label>
            <select
              id="transportType"
              name="transportType"
              value={formData.transportType}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="bike">Bike</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition duration-200"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="flex-1 bg-gray-700 text-yellow-300 font-bold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupForm;