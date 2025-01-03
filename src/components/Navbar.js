// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import logo from './logo.png';

const Navbar = ({ loggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-content">
        {loggedIn ? (
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <span></span> // Or other content when logged out
        )}
      </div>
    </nav>
  );
};

export default Navbar;
