// src/App.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Adjusted import path
import HomePage from './components/HomePage'; // Adjusted import path


const App = () => {
  const [editingItem, setEditingItem] = useState(null); // Currently unused but may be for future edits
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          {/* Route for Landing Page */}
          <Route path="/" element={<LandingPage />} />
          {/* Redirect to HomePage if authenticated; otherwise, go to login */}
          <Route
            path="/HomePage"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
