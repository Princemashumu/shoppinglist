import React from 'react';
import './Sidebar.css'; // Sidebar styles
import logo from './logo.png'; // Ensure the logo path is correct

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Menu Items */}
      <div className="menu-item" onClick={() => onSelect('add')}>
        Add Item
      </div>
      <div className="menu-item" onClick={() => onSelect('edit')}>
        Edit Item
      </div>
    </div>
  );
};

export default Sidebar;
