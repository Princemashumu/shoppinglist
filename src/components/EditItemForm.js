// src/components/EditItemForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateItem } from '../features/shoppingListSlice'; // Ensure you have this action

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

const EditItemForm = ({ item, onEditComplete }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setNotes(item.notes);
      setSelectedCategory(item.category || ''); // Set category if exists
      setSelectedTag(item.tag || ''); // Set tag if exists
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Item name is required.";
    if (!quantity) newErrors.quantity = "Quantity is required.";
    if (!selectedCategory) newErrors.category = "Category is required.";
    if (!selectedTag) newErrors.tag = "Tag is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    }

    // Dispatch action to update the item
    dispatch(updateItem({ 
      ...item, 
      name, 
      quantity, 
      notes, 
      category: selectedCategory, // Update category
      tag: selectedTag            // Update tag
    }));
    
    // Clear form fields
    onEditComplete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Item</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity}</p>}

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
      {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}

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
      {errors.tag && <p style={{ color: 'red' }}>{errors.tag}</p>}

      <textarea
        placeholder="Optional Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Update Item</button>
    </form>
  );
};

export default EditItemForm;
