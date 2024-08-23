import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, TextField, IconButton, Button, Snackbar, Alert} from '@mui/material';
import { Edit, Save, Cancel, Add, Delete, Share } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, addItem, updateItem, deleteItem, setTitle } from '../redux/slices/grocerySlice';
import logo from '../logo.png';

function GroceryList() {
  const dispatch = useDispatch();
  const { fruitVeg, meat, beverages, bathing, loading } = useSelector((state) => state.grocery);
  const userId = useSelector((state) => state.auth.userId);


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
  
  
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
 
 
  useEffect(() => {
    dispatch(fetchItems(userId));
  }, [dispatch, userId]);

  const handleInputChange = (e, category, field) => {
    setNewItem({
      ...newItem,
      [category]: { ...newItem[category], [field]: e.target.value },
    });
  };

  const handleSave = async (category) => {
    const { name, quantity, price, notes } = newItem[category];
    
    // Basic validation
    if (name.trim() === '' || quantity.trim() === '' || price.trim() === '') return;
  
    try {
      if (isEditing[category] !== null) {
        // Editing existing item
        const id = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)[isEditing[category]].id;
        await dispatch(updateItem({ category, id, item: { name, quantity, price, notes }, userId }));
        setSnackbarMessage('Item updated successfully!');
      } else {
        // Adding new item
        await dispatch(addItem({ category, item: { name, quantity, price, notes }, userId }));
        setSnackbarMessage('Item added successfully!');
      }
      
      // Reset form and state
      setNewItem({
        ...newItem,
        [category]: { name: '', quantity: '', price: '', notes: '' },
      });
      setIsEditing({ ...isEditing, [category]: null });
      setAddingItem({ ...addingItem, [category]: false });
      setEditingTitle({ ...editingTitle, [category]: false });
      setSnackbarOpen(true);
      
      // Reload the page (if necessary)
      window.location.reload();
      
    } catch (error) {
      setSnackbarMessage('Error saving item. Please try again.');
      setSnackbarOpen(true);
    }
  

    // setNewItem({ ...newItem, [category]: { name: '', quantity: '', price: '', notes: '' } });
    // setAddingItem({ ...addingItem, [category]: false });
    // setEditingTitle({ ...editingTitle, [category]: false });

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

  const handleDelete = async (category, index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Get the item ID based on the category and index
        const id = (category === 'fruitVeg' ? fruitVeg : category === 'meat' ? meat : category === 'beverages' ? beverages : bathing)[index].id;
        
        // Dispatch the delete action
        await dispatch(deleteItem({ category, id, userId }));
        
        // Notify the user of success and reload the page
        setSnackbarMessage('Item deleted successfully!');
        setSnackbarOpen(true);
        window.location.reload(); // Consider alternatives to full page reload if possible
  
      } catch (error) {
        // Handle any errors during deletion
        setSnackbarMessage('Error deleting item. Please try again.');
        setSnackbarOpen(true);
      }
    }
  }
  

  const handleTitleChange = (e, category) => {
    const newTitle = e.target.value;
  
    // Basic validation: ensure the title is not empty
    if (newTitle.trim() === '') {
      // Handle empty title case (e.g., show a message or prevent saving)
      console.error('Title cannot be empty');
      return;
    }
  
    // Update the local state with the new title
    setTitles({
      ...titles,
      [category]: newTitle,
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
    const textToCopy = `Grocery List - ${title}\n\n${items}\n\n${window.location.href}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setSnackbarMessage('Link copied to clipboard!');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
          setSnackbarMessage('Failed to copy link.');
          setSnackbarOpen(true);
        });
    } else {
      alert('Clipboard API is not supported on this browser.');
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };



  return (
    <Box sx={{ p: 2 }}>
     {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <img src={logo} alt="Loading..." width={100} height={100} />
        </Box>
      )}
      <Grid container spacing={2}>
        {['fruitVeg', 'meat', 'beverages', 'bathing'].map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
             <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  p: 1,
                   border: '1px solid black',
                   borderRadius: 1,
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
                  transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for hover effect
                  '&:hover': {
                    transform: 'translateY(-2px)', // Slight lift on hover
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
                  },
                }}
              >
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 ,color:"blue"}}>
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
                <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  p: 1,
                  border: '1px solid #eee',
                  borderRadius: 1,
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)', // Subtle shadow
                  transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for hover effect
                  '&:hover': {
                    transform: 'translateY(-2px)', // Slight lift on hover
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
                    color:"white",
                  },
                }}
              >
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
              <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  p: 1,
                  // border: '1px solid #eee',
                  // borderRadius: 1,
                  // boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
                  transition: 'transform 0.2s, box-shadow 0.2s', // Smooth transition for hover effect
                  '&:hover': {
                    transform: 'translateY(-2px)', // Slight lift on hover
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
                  },
                }}
              >
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
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GroceryList;
