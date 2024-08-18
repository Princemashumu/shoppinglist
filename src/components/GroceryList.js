import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, IconButton, Button, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import { Save, Edit, Delete, Cancel, Share } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const serializeData = (data) => {
  return encodeURIComponent(JSON.stringify(data));
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copying to clipboard was successful!');
  }, (err) => {
    console.error('Could not copy text: ', err);
  });
};

function GroceryList() {
  const [items, setItems] = useState({
    fruitVeg: [],
    meat: [],
    beverages: [],
    bathing: [],
  });

  const [editState, setEditState] = useState({
    fruitVeg: false,
    meat: false,
    beverages: false,
    bathing: false,
  });

  const [newItem, setNewItem] = useState({
    fruitVeg: { name: '', quantity: '', price: '', notes: '' },
    meat: { name: '', quantity: '', price: '', notes: '' },
    beverages: { name: '', quantity: '', price: '', notes: '' },
    bathing: { name: '', quantity: '', price: '', notes: '' },
  });

  const [isEditing, setIsEditing] = useState({
    fruitVeg: null,
    meat: null,
    beverages: null,
    bathing: null,
  });

  const [titles, setTitles] = useState({
    fruitVeg: 'Fruit & Veg',
    meat: 'Meat',
    beverages: 'Beverages',
    bathing: 'Bathing',
  });

  const [editingTitle, setEditingTitle] = useState({
    fruitVeg: false,
    meat: false,
    beverages: false,
    bathing: false,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/fruitVeg`);
        setItems((prevItems) => ({ ...prevItems, fruitVeg: data }));
        const { data: meatData } = await axios.get(`${API_URL}/meat`);
        setItems((prevItems) => ({ ...prevItems, meat: meatData }));
        const { data: beveragesData } = await axios.get(`${API_URL}/beverages`);
        setItems((prevItems) => ({ ...prevItems, beverages: beveragesData }));
        const { data: bathingData } = await axios.get(`${API_URL}/bathing`);
        setItems((prevItems) => ({ ...prevItems, bathing: bathingData }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchItems();
  }, []);

  const handleInputChange = (e, category, field) => {
    setNewItem({
      ...newItem,
      [category]: { ...newItem[category], [field]: e.target.value },
    });
  };

  const handleSave = async (category) => {
    const { name, quantity, price, notes } = newItem[category];
    if (name.trim() === '' || quantity.trim() === '' || price.trim() === '') return;

    const updatedItems = [...items[category]];
    if (isEditing[category] !== null) {
      updatedItems[isEditing[category]] = { name, quantity, price, notes };
      await axios.put(`${API_URL}/${category}/${items[category][isEditing[category]].id}`, { name, quantity, price, notes });
      setIsEditing({
        ...isEditing,
        [category]: null,
      });
    } else {
      const response = await axios.post(`${API_URL}/${category}`, { name, quantity, price, notes });
      updatedItems.push(response.data);
    }

    setItems({
      ...items,
      [category]: updatedItems,
    });

    setNewItem({
      ...newItem,
      [category]: { name: '', quantity: '', price: '', notes: '' },
    });

    setEditState({
      ...editState,
      [category]: false,
    });
  };

  const handleEdit = (category, index) => {
    setIsEditing({
      ...isEditing,
      [category]: index,
    });

    setNewItem({
      ...newItem,
      [category]: { ...items[category][index] },
    });

    setEditState({
      ...editState,
      [category]: true,
    });
  };

  const handleDelete = async (category, index) => {
    await axios.delete(`${API_URL}/${category}/${items[category][index].id}`);
    setItems({
      ...items,
      [category]: items[category].filter((_, i) => i !== index),
    });
  };

  const handleTitleChange = (e, category) => {
    setTitles({
      ...titles,
      [category]: e.target.value,
    });
  };

  const saveTitle = (category) => {
    setEditingTitle({
      ...editingTitle,
      [category]: false,
    });
  };

  const cancelEdit = (category) => {
    setEditState({
      ...editState,
      [category]: false,
    });

    setNewItem({
      ...newItem,
      [category]: { name: '', quantity: '', price: '', notes: '' },
    });
  };

  const calculateTotal = (category) => {
    return items[category].reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const filteredItems = (category) => {
    return items[category].filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderCategory = (category) => (
    <Grid item xs={12} sm={6} md={3}>
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          textAlign: 'center', 
          boxShadow: 1,
          border: '1px solid #ccc',
          borderRadius: 1,
        }}
      >
        {editingTitle[category] ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TextField
              value={titles[category]}
              onChange={(e) => handleTitleChange(e, category)}
              size="small"
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => saveTitle(category)} color="primary">
              <Save />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{titles[category]}</Typography>
            <IconButton onClick={() => setEditingTitle({ ...editingTitle, [category]: true })} color="secondary">
              <Edit />
            </IconButton>
          </Box>
        )}

        <List>
          {filteredItems(category).map((item, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText 
                primary={`${item.name} (Qty: ${item.quantity}, R${(parseFloat(item.price) || 0).toFixed(2)})`}
                secondary={item.notes}
              />
              <Box>
                <IconButton onClick={() => handleEdit(category, index)} color="secondary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(category, index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        {editState[category] ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
            <TextField
              value={newItem[category].name}
              onChange={(e) => handleInputChange(e, category, 'name')}
              placeholder="Item Name"
              size="small"
              sx={{ mr: 2, mb: 1, width: '100%' }}
            />
            <TextField
              value={newItem[category].quantity}
              onChange={(e) => handleInputChange(e, category, 'quantity')}
              placeholder="Quantity"
              size="small"
              sx={{ mr: 2, mb: 1, width: '100%' }}
            />
            <TextField
              value={newItem[category].price}
              onChange={(e) => handleInputChange(e, category, 'price')}
              placeholder="Price"
              size="small"
              sx={{ mr: 2, mb: 1, width: '100%' }}
            />
            <TextField
              value={newItem[category].notes}
              onChange={(e) => handleInputChange(e, category, 'notes')}
              placeholder="Notes (optional)"
              size="small"
              sx={{ mb: 1, width: '100%' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconButton onClick={() => handleSave(category)} color="primary" sx={{ mr: 1 }}>
                <Save />
              </IconButton>
              <IconButton onClick={() => cancelEdit(category)} color="error">
                <Cancel />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Button 
            variant="outlined"
            onClick={() => setEditState({ ...editState, [category]: true })} 
            sx={{ 
              mt: 1,
              borderColor: 'purple',
              color: 'purple',
              '&:hover': {
                borderColor: 'darkpurple',
                color: 'darkpurple',
                backgroundColor: 'rgba(128, 0, 128, 0.1)',
              },
            }}
          >
            Add Item
          </Button>
        )}
        <Typography variant="body1" sx={{ mt: 2 }}>
          Total: R{calculateTotal(category).toFixed(2)}
        </Typography>
        <Button 
          variant="outlined"
          startIcon={<Share />}
          onClick={() => {
            const data = serializeData(items);
            const url = `${window.location.origin}/share?data=${data}`;
            copyToClipboard(url);
            setOpenSnackbar(true);
          }}
          sx={{ mt: 2 }}
        >
          Share List
        </Button>
      </Box>
    </Grid>
  );

  return (
    <Box 
      sx={{ 
        p: 2, 
        backgroundColor: '#f5f5f5', 
        flexGrow: 1 
      }}
    >
      <Grid container spacing={2}>
        {renderCategory('fruitVeg')}
        {renderCategory('meat')}
        {renderCategory('beverages')}
        {renderCategory('bathing')}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Shareable link copied to clipboard"
      />
    </Box>
  );
}

export default GroceryList;
