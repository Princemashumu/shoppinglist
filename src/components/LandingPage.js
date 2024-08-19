import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png'; // Adjust the path if necessary
import Footer from './Footer';

function LandingPage() {
  const [signUpData, setSignUpData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

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

    setShowLoader(true);

    try {
      // Simulate network delay with a delay before showing the loader
      await new Promise(resolve => setTimeout(resolve, 100)); // Short delay before showing the loader
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) throw new Error('Network response was not ok.');
      const users = await response.json();
      const userExists = users.some(user => user.username === username);

      if (userExists) {
        setSnackbarMessage('Username already exists.');
        setSnackbarOpen(true);
        setShowLoader(false);
        return;
      }

      const newUser = { username, password };
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Failed to sign up.');

      setSnackbarMessage('Sign up successful');
      setSnackbarOpen(true);
      setDialogOpen(true);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setShowLoader(false);
    }
  };

  const handleLogin = async () => {
    const { username, password } = loginData;
    setLoginLoading(true);
    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) throw new Error('Network response was not ok.');
      const users = await response.json();
      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
        navigate('/home');
      } else {
        setSnackbarMessage('Invalid username or password.');
        setSnackbarOpen(true);
      }
      setDialogOpen(false);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setLoginLoading(false);
    }
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
          <Box>
            <Button
              variant="outlined"
              sx={{
                color: '#333',
                borderColor: '#333',
                mr: 1,
                '&:hover': {
                  borderColor: 'red',
                  color: 'red',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                },
              }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              sx={{
                color: '#fff',
                backgroundColor: '#333',
                mr: 1,
                '&:hover': {
                  backgroundColor: 'red',
                  color: '#fff',
                },
              }}
              onClick={() => setDialogOpen(true)}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(80vh - 100px)' }}>
        {showLoader ? (
          <Box sx={{ textAlign: 'center' }}>
            <img src={logo} alt="Loading..." style={{ width: '100px', height: '100px' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Please wait...
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              maxWidth: '400px',
              width: '100%',
              backgroundColor: '#fff',
              mb: 10, // Add margin-bottom to create space for the footer
            }}
          >
            <Typography variant="h4" gutterBottom>
              Create Account
            </Typography>
            <TextField
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignUp}
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          {loginLoading ? (
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
              <img src={logo} alt="Logging in..." style={{ width: '100px', height: '100px' }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Logging in...
              </Typography>
            </Box>
          ) : (
            <>
              <TextField
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary" disabled={loginLoading}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
}

export default LandingPage;
