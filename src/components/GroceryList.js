import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, IconButton, Button, CircularProgress } from '@mui/material';
import { Edit, Save, Cancel, Add, Delete, Share } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, addItem, updateItem, deleteItem, setTitle } from '../redux/slices/grocerySlice';

function GroceryList() {
  const dispatch = useDispatch();
  const { fruitVeg, meat, beverages, bathing, loading } = useSelector((state) => state.grocery);

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

  const [addingItem, setAddingItem] = useState({
    fruitVeg: false,
    meat: false,
    beverages: false,
    bathing: false,
  });

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleInputChange = (e, category, field) => {
    setNewItem({
      ...newItem,
      [category]: { ...newItem[category], [field]: e.target.value },
    });
  };

  const handleSave = (category) => {
    const { name, quantity, price, notes } = newItem[category];
    if (name.trim() === '' || quantity.trim() === '' || price.trim() === '') return;

    if (isEditing[category] !== null) {
      const id = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)[isEditing[category]].id;
      dispatch(updateItem({ category, id, item: { name, quantity, price, notes } }));
      setIsEditing({
        ...isEditing,
        [category]: null,
      });
    } else {
      dispatch(addItem({ category, item: { name, quantity, price, notes } }));
    }

    setNewItem({
      ...newItem,
      [category]: { name: '', quantity: '', price: '', notes: '' },
    });

    setAddingItem({
      ...addingItem,
      [category]: false,
    });

    setEditingTitle({
      ...editingTitle,
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
      [category]: { ...((category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)[index]) },
    });

    setAddingItem({
      ...addingItem,
      [category]: true,
    });

    setEditingTitle({
      ...editingTitle,
      [category]: true,
    });
  };

  const handleDelete = (category, index) => {
    const id = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)[index].id;
    dispatch(deleteItem({ category, id }));
  };

  const handleTitleChange = (e, category) => {
    setTitles({
      ...titles,
      [category]: e.target.value,
    });
  };

  const saveTitle = (category) => {
    dispatch(setTitle({ category, title: titles[category] }));
    setEditingTitle({
      ...editingTitle,
      [category]: false,
    });
  };

  const handleAddItem = (category) => {
    setAddingItem({
      ...addingItem,
      [category]: true,
    });
    setIsEditing({
      ...isEditing,
      [category]: null,
    });
    setNewItem({
      ...newItem,
      [category]: { name: '', quantity: '', price: '', notes: '' },
    });
  };

  const cancelEdit = (category) => {
    setEditingTitle({
      ...editingTitle,
      [category]: false,
    });

    setNewItem({
      ...newItem,
      [category]: { name: '', quantity: '', price: '', notes: '' },
    });
  };

  const calculateTotal = (category) => {
    const total = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)
      .reduce((sum, item) => sum + item.quantity * item.price, 0);
    return total.toFixed(2); // Returns total with two decimal points
  };

  const handleShare = (category) => {
    const items = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)
      .map(item => `Name: ${item.name}, Quantity: ${item.quantity}, Price: R${item.price}, Notes: ${item.notes}`)
      .join('\n');
    const title = titles[category];
    
    if (navigator.share) {
      navigator.share({
        title: `Grocery List - ${title}`,
        text: items,
        url: window.location.href,
      })
      .then(() => console.log('Share successful'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Share functionality is not supported on this browser.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {loading && <CircularProgress />}
      <Grid container spacing={2}>
        {['fruitVeg', 'meat', 'beverages', 'bathing'].map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              {editingTitle[category] ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Title"
                    value={titles[category]}
                    onChange={(e) => handleTitleChange(e, category)}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton color="primary" onClick={() => saveTitle(category)}>
                      <Save />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => cancelEdit(category)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{titles[category]}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => setEditingTitle({ ...editingTitle, [category]: true })}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleShare(category)}>
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              )}
              {addingItem[category] ? (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Name"
                    value={newItem[category].name}
                    onChange={(e) => handleInputChange(e, category, 'name')}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Quantity"
                    value={newItem[category].quantity}
                    onChange={(e) => handleInputChange(e, category, 'quantity')}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Price (R)"
                    value={newItem[category].price}
                    onChange={(e) => handleInputChange(e, category, 'price')}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Notes"
                    value={newItem[category].notes}
                    onChange={(e) => handleInputChange(e, category, 'notes')}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton color="primary" onClick={() => handleSave(category)}>
                      <Save />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => setAddingItem({ ...addingItem, [category]: false })}>
                      <Cancel />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  onClick={() => handleAddItem(category)}
                >
                  Add Item
                </Button>
              )}
              <Box sx={{ mt: 2 }}>
                {(category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing).map((item, index) => (
                  <Box key={item.id} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                    <Typography variant="body2">Price: R{item.price}</Typography>
                    <Typography variant="body2">Notes: {item.notes}</Typography>
                    <Typography variant="body2">Total: R{(item.quantity * item.price).toFixed(2)}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <IconButton color="primary" size="small" onClick={() => handleEdit(category, index)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="secondary" size="small" onClick={() => handleDelete(category, index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Total for {titles[category]}:</strong> R{calculateTotal(category)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default GroceryList;
