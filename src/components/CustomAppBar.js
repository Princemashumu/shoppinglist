import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, Snackbar, InputAdornment, List, ListItem, ListItemText
} from '@mui/material';
import { Logout as LogoutIcon, PersonAdd as PersonAddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function CustomAppBar() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [signUpData, setSignUpData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [openSearchResults, setOpenSearchResults] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsSignedIn(false);
    navigate("/");
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

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const endpoints = ['fruitVeg', 'meat', 'beverages', 'bathing'];
      const allResults = [];

      // Fetch results from each endpoint
      for (const endpoint of endpoints) {
        const response = await fetch(`http://localhost:5000/${endpoint}?name=${searchQuery}`);
        const results = await response.json();
        allResults.push(...results);
      }

      setSearchResults(allResults);
      setOpenSearchResults(true);
    } catch (error) {
      setSnackbarMessage('Search failed');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSearchResults = () => setOpenSearchResults(false);

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
          width: 'calc(100% - 20px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#333' }}>
            <span style={{ color: 'red' }}>L</span>ist
          </Typography>
          {isSignedIn ? (
            <>
              <TextField
                variant="outlined"
                placeholder="Find your grocery list fast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
                sx={{
                  backgroundColor: 'orange',
                  input: { color: 'white' },
                  borderRadius: 1,
                  width: { xs: '150px', sm: '300px' }, // Responsive width
                  mr: 2,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton edge="end" color="inherit" onClick={handleSignOut}>
                <LogoutIcon sx={{ color: '#333' }} />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenSignUp}
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenLogin}
              >
                Login
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
            variant="outlined"
            value={signUpData.username}
            onChange={handleSignUpChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={signUpData.password}
            onChange={handleSignUpChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={signUpData.confirmPassword}
            onChange={handleSignUpChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignUp} color="secondary">Cancel</Button>
          <Button onClick={handleSignUp} color="primary">Sign Up</Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleCloseLogin}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={loginData.username}
            onChange={handleLoginChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={loginData.password}
            onChange={handleLoginChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogin} color="secondary">Cancel</Button>
          <Button onClick={handleLogin} color="primary">Login</Button>
        </DialogActions>
      </Dialog>

      {/* Search Results Dialog */}
      <Dialog open={openSearchResults} onClose={handleCloseSearchResults}>
        <DialogTitle>Search Results</DialogTitle>
        <DialogContent>
          <List>
            {searchResults.map((result, index) => (
              <ListItem button key={index}>
                <ListItemText primary={result.name} secondary={`Price: ${result.price}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearchResults} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default CustomAppBar;
