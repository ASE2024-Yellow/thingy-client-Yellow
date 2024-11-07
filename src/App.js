import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./App.css"; // Import the main CSS file
import Dashboard from "./components/Dashboard";
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import UsersList from './components/UsersList';
import VehiclePage from "./components/VehiclePage";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/user/signin" element={<LoginForm />} />
          <Route path="/user/signup" element={<SignupForm />} />
          <Route path="/users" element={<UsersList />} />

          {/* Protect the Profile route */}
          <Route path="/user/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Protect the Dashboard route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/vehicle/:type" element={<ProtectedRoute><VehiclePage /></ProtectedRoute>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
