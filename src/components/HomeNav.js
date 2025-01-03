// src/components/Navbar.js
import React from 'react';
import './Navbar.css'; // Import the CSS file
import logo from './logo.png'

const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" /> {/* Replace with your logo path */}
        </div>
      <div className="navbar-content">
      </div>
    </nav>
  );
};

export default Navbar;
