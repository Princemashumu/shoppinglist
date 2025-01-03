// src/components/AddItemForm.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const categories = [
  { id: 1, name: 'Groceries' },
  { id: 2, name: 'Utilities' },
  { id: 3, name: 'Clothing' },
  { id: 4, name: 'Electronics' },
];

const tags = [
  { id: 1, name: 'Essential' },
  { id: 2, name: 'Non-Essential' },
  { id: 3, name: 'Urgent' },
  { id: 4, name: 'Seasonal' },
];

const AddItemForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [notes, setNotes] = useState(''); // New state for notes
  const userId = useSelector(state => state.auth.user.id); // Get user ID from Redux store

  const handleAddItem = async (e) => {
    e.preventDefault();

    const newItem = { 
      name: itemName, 
      quantity, 
      category: selectedCategory, // Include selected category
      tag: selectedTag,           // Include selected tag
      notes,                      // Include notes
      userId 
    }; 

    // Post new item to JSON Server
    try {
      const response = await fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setItemName(''); // Reset the input field
        setQuantity(1);  // Reset quantity to default
        setSelectedCategory(''); // Reset selected category
        setSelectedTag(''); // Reset selected tag
        setNotes(''); // Reset notes
        alert('Item added successfully!');
      } else {
        alert('Failed to add item. Please try again.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleAddItem}>
      <h2>Add Item</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        required
      />
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)} 
        required
      >
        <option value="">Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <select 
        value={selectedTag} 
        onChange={(e) => setSelectedTag(e.target.value)} 
        required
      >
        <option value="">Select a tag</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Optional Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
