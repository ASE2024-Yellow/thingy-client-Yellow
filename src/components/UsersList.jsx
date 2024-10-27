import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersList.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token for authorization
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div className="users-list-container">
      <div className="header">
        <h2>Users List</h2>
        <button className="dashboard-button" onClick={handleBackToDashboard}>
          Go to Dashboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-info">
              <h3 className="user-username">{user.username}</h3>
              <p className="user-email">{user.email}</p>
              <span className="user-transport-type">Transport Type: {user.transportType}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
