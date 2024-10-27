import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    transportType: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing
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
    setIsEditing(!isEditing); // Toggle editing mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3000/user/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false); // Exit editing mode after successful update
    } catch (error) {
      setErrorMessage('Failed to update profile.');
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmation = window.confirm('Are you sure you want to delete your profile?');
    if (!confirmation) {
      return; // User canceled, do nothing
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
    <div className="profile-container">
      <div className="top-buttons">
        <button className="back-button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2>User Profile</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="profile-box" onSubmit={handleProfileUpdate}>
        <div className="profile-details">
          <div className="profile-field">
            <label className="profile-label">Username:</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                className="input-field"
                value={profileData.username}
                onChange={handleInputChange}
                required
              />
            ) : (
              <div className="profile-value">{profileData.username}</div>
            )}
          </div>
          <div className="profile-field">
            <label className="profile-label">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="input-field"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            ) : (
              <div className="profile-value">{profileData.email}</div>
            )}
          </div>
          <div className="profile-field">
            <label className="profile-label">Transport Type:</label>
            {isEditing ? (
              <select
                name="transportType"
                className="input-field"
                value={profileData.transportType}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Transport Type</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
              </select>
            ) : (
              <div className="profile-value">{profileData.transportType}</div>
            )}
          </div>
        </div>
        <button className="edit-button" type="button" onClick={handleEditToggle}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        {isEditing && <button className="save-button" type="submit">Save Changes</button>}
        <button className="delete-button" type="button" onClick={handleDeleteProfile}>
          Delete Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
