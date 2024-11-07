import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-yellow-500 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-300">Users List</h2>
          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 font-semibold"
            onClick={handleBackToDashboard}
          >
            Go to Dashboard
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-yellow-300">{user.username}</h3>
                <p className="text-yellow-100">{user.email}</p>
                <span className="text-yellow-200 mt-2">
                  Transport Type: {user.transportType}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersList;