import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, List, ListItem, ListItemText } from '@mui/material';
import { Search as SearchIcon, Logout as LogoutIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#000',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
}));

function CustomAppBar({ onSearch }) {
  const [isSignedIn, setIsSignedIn] = useState(true); // Assume true for demonstration
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openItemDetailsDialog, setOpenItemDetailsDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const [signUpData, setSignUpData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
 
 
  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    if (searchValue) {
      fetch(`http://localhost:5000/items?q=${encodeURIComponent(searchValue)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Search results:', data); // Debugging line
          if (Array.isArray(data) && data.length > 0) {
            setSearchedItems(data);
          } else {
            setSearchedItems([]); // Clear results if no items found
          }
          setOpenSearchDialog(true);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setSnackbarMessage(`Error fetching search results: ${error.message}`);
          setSnackbarOpen(true);
        });
    } else {
      setSearchedItems([]); // Clear results if search value is empty
      setOpenSearchDialog(false);
    }
  };
  

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  const handleSignUpChange = (e) => setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignUp = async () => {
    const { username, password, confirmPassword } = signUpData;
    if (!username || !password || !confirmPassword) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        setSnackbarMessage('Sign up successful');
        setSnackbarOpen(true);
        handleCloseSignUp();
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleLogin = async () => {
    const { username, password } = loginData;
    if (!username || !password) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        setSnackbarMessage('Login successful');
        setSnackbarOpen(true);
        setIsSignedIn(true);
        handleCloseLogin();
      } else {
        setSnackbarMessage('Invalid username or password.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Login failed');
      setSnackbarOpen(true);
    }
  };

  const handleItemClick = (item) => {
    // Example logic for fetching full details of the item
    const itemDetails = `Full details of ${item}`;
    setSelectedItemDetails(itemDetails);
    setOpenItemDetailsDialog(true);
  };

  const handleCloseItemDetailsDialog = () => {
    setOpenItemDetailsDialog(false);
    setSelectedItemDetails(null);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '10px' }}>
      <AppBar 
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          left: '10px',
          right: '10px',
          top: '10px',
          margin: 'auto',
          width: 'calc(100% - 20px)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#333' }}>
            <span style={{ color: 'red' }}>L</span>ist
          </Typography>
          {isSignedIn ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: '#000' }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={handleSearchChange}
                />
              </Search>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#333' }}>
                Please Sign Up or Log In
              </Typography>
            </Box>
          )}
          {isSignedIn ? (
            <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleSignOut}>
              <LogoutIcon sx={{ color: '#333' }} />
            </IconButton>
          ) : (
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<PersonAddIcon />} 
                onClick={handleOpenSignUp} 
                sx={{ marginRight: 2 }}
              >
                Sign Up
              </Button>
              <Button variant="outlined" onClick={handleOpenLogin}>
                Log In
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sign Up Dialog */}
      <Dialog open={openSignUp} onClose={handleCloseSignUp}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={signUpData.username}
            onChange={handleSignUpChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={signUpData.password}
            onChange={handleSignUpChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
            value={signUpData.confirmPassword}
            onChange={handleSignUpChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignUp}>Cancel</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </DialogActions>
      </Dialog>

      {/* Log In Dialog */}
      <Dialog open={openLogin} onClose={handleCloseLogin}>
        <DialogTitle>Log In</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={loginData.username}
            onChange={handleLoginChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={loginData.password}
            onChange={handleLoginChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogin}>Cancel</Button>
          <Button onClick={handleLogin}>Log In</Button>
        </DialogActions>
      </Dialog>

      {/* Search Results Dialog */}
      <Dialog open={openSearchDialog} onClose={() => setOpenSearchDialog(false)}>
        <DialogTitle>Search Results</DialogTitle>
        <DialogContent>
          <List>
            {searchedItems.length > 0 ? (
              searchedItems.map(item => (
                <ListItem button key={item.id} onClick={() => handleItemClick(item)}>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))
            ) : (
              <Typography>No results found</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Item Details Dialog */}
      <Dialog open={openItemDetailsDialog} onClose={handleCloseItemDetailsDialog}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          <Typography>{selectedItemDetails}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default CustomAppBar;
