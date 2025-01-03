import React, { useState } from 'react';
import AddItemForm from '../components/AddItemForm';
import ShoppingList from '../components/ShoppingList';
import EditItemForm from '../components/EditItemForm';
import './HomePage.css'; // Import CSS file here
import Navbar from '../components/Navbar'; // Adjusted import path
const HomePage = () => {
  const [editingItem, setEditingItem] = useState(null);

  return (
    <div className="main">
      {editingItem ? (
        <EditItemForm item={editingItem} onEditComplete={() => setEditingItem(null)} />
      ) : (
        <div className="container">
          <div className="left">
            <AddItemForm />
          </div>
          <div className="right">
            <ShoppingList onEdit={setEditingItem} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
