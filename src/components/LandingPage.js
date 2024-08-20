import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, login, logout } from '../redux/slices/authSlice'; // Adjust the path if necessary
import logo from '../logo.png'; // Import the logo image
import Footer from './Footer';

function LandingPage() {
  const [signUpData, setSignUpData] = useState({ username: '', password: '', confirmPassword: '', acceptTerms: false });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from the Redux store
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setSnackbarMessage('Login successful');
      setSnackbarOpen(true);
      navigate('/home');
      setDialogOpen(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleSignUpChange = (e) => setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignUp = async () => {
    const { username, password, confirmPassword, acceptTerms } = signUpData;
    if (!username || !password || !confirmPassword || !acceptTerms) {
      setSnackbarMessage('Please fill in all fields and accept the terms.');
      setSnackbarOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarOpen(true);
      return;
    }

    setShowLoader(true);
    await dispatch(signUp({ username, password }));
    setShowLoader(false);
  };

  const handleLogin = async () => {
    const { username, password } = loginData;
    setShowLoader(true);
    await dispatch(login({ username, password }));
    setShowLoader(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Navigate to the landing page or any other route you want
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '40px', height: 'auto', marginRight: '16px' }} />
            <Typography variant="h6" noWrap component="div" sx={{ color: '#333' }}>
              <span style={{ color: 'red' }}>L</span>ist
            </Typography>
          </Box>
          <Box>
            {user ? (
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
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
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
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(80vh - 100px)' }}>
        {showLoader ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            zIndex: 1300, // High z-index to cover the entire page
          }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                onChange={() => setSignUpData(prev => ({ ...prev, acceptTerms: !prev.acceptTerms }))}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                I accept the 
                <Link
                  href="#"
                  onClick={() => setPrivacyDialogOpen(true)}
                  sx={{ ml: 1, color: 'blue' }}
                >
                  Privacy Policy
                </Link>
                and
                <Link
                  href="#"
                  onClick={() => setTermsDialogOpen(true)}
                  sx={{ ml: 1, color: 'blue' }}
                >
                  Terms and Conditions
                </Link>.
              </Typography>
            </Box>
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
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
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
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </Button>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={privacyDialogOpen}
        onClose={() => setPrivacyDialogOpen(false)}
      >
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {/* Add your Privacy Policy content here */}
            Your privacy policy content goes here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
      >
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {/* Add your Terms and Conditions content here */}
            Your terms and conditions content goes here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}

export default LandingPage;
