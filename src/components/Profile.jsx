import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    transportType: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch profile information.');
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/user/signin');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3000/user/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Failed to update profile.');
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmation = window.confirm('Are you sure you want to delete your profile?');
    if (!confirmation) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/user/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/user/signin');
    } catch (error) {
      setErrorMessage('Failed to delete profile.');
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-yellow-500 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between mb-6">
          <button
            onClick={handleBackToDashboard}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 font-semibold"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">User Profile</h2>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">Username:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <div className="text-yellow-300 bg-gray-800 px-3 py-2 rounded-md">{profileData.username}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              ) : (
                <div className="text-yellow-300 bg-gray-800 px-3 py-2 rounded-md">{profileData.email}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">Transport Type:</label>
              {isEditing ? (
                <select
                  name="transportType"
                  value={profileData.transportType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="" disabled>Select Transport Type</option>
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                  <option value="Bus">Bus</option>
                  <option value="Train">Train</option>
                </select>
              ) : (
                <div className="text-yellow-300 bg-gray-800 px-3 py-2 rounded-md">{profileData.transportType}</div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleEditToggle}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
          <button
            onClick={handleDeleteProfile}
            className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;