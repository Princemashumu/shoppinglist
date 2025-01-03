import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setItems, deleteItem } from '../features/shoppingListSlice';

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

const ShoppingList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.shoppingList.items);
  const userId = useSelector(state => state.auth.user.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOption, setSortOption] = useState('name');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/items?userId=${userId}`);
        const data = await response.json();
        dispatch(setItems(data));
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (userId) {
      fetchItems();
    }
  }, [dispatch, userId]);

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch(deleteItem(itemId));
        alert('Item deleted successfully!');
      } else {
        alert('Failed to delete item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesTag = selectedTag ? item.tag === selectedTag : true;
    return matchesSearchTerm && matchesCategory && matchesTag;
  });

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // Inline styles for modern design
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, sans-serif',
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#333',
      backgroundColor: '#f9f9f9',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      color: '#333',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
    },
    list: {
      listStyle: 'none',
      padding: '0',
      maxHeight: '300px', // Fixed height for scroll effect
      overflowY: 'auto',  // Enable vertical scrolling
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    listItemHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    button: {
      padding: '8px 12px',
      marginLeft: '8px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Shopping List</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.select}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        style={styles.select}
      >
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={styles.select}
      >
        <option value="name">Sort by Name</option>
        <option value="category">Sort by Category</option>
      </select>
      <ul style={styles.list}>
        {sortedItems.map(item => (
          <li
            key={item.id}
            style={styles.listItem}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              {item.name} (Quantity: {item.quantity})
              {item.notes && <div>Notes: {item.notes}</div>}
            </div>
            <div>
              <button
                style={{ ...styles.button, ...styles.editButton }}
                onClick={() => onEdit(item)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Edit
              </button>
              <button
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={() => handleDeleteItem(item.id)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
