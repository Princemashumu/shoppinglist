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
import backgroundImg from '../bg.jpg';


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
    <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      overflowX: 'hidden', // Prevent horizontal scrolling
      bgcolor: '#f5f5f5', // Background color for the entire page
      backgroundImage: `url(${backgroundImg})`, // Background image
      backgroundSize: 'cover', // Cover the entire container
      backgroundPosition: 'center', // Center the background image
      backgroundRepeat: 'no-repeat', // Prevent repeating the background image
    }}
  >
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
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 10px' }}>
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

      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(80vh - 100px)', padding: '0 10px' }}>
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
          <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Shopping List App! We are committed to protecting your privacy and ensuring a safe online experience. This Privacy Policy explains how we collect, use, and share your personal information when you use our app.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Information We Collect
      </Typography>
      <Typography variant="h6" gutterBottom>
        2.1 Personal Information
      </Typography>
      <Typography variant="body1" paragraph>
        When you use our app, we may collect personal information that you provide directly, including:
      </Typography>
      <Typography variant="body1" paragraph>
        - Registration Information: Username, password, and email address.
        <br />
        - Profile Information: Any additional details you provide in your profile.
        <br />
        - Usage Data: Information about how you use our app, such as features accessed and activities performed.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2.2 Non-Personal Information
      </Typography>
      <Typography variant="body1" paragraph>
        We may also collect non-personal information, including:
      </Typography>
      <Typography variant="body1" paragraph>
        - Device Information: Information about your device, including its model, operating system, and unique identifiers.
        <br />
        - Log Data: Details of your interactions with our app, including IP addresses and timestamps.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We use your information for various purposes, including:
      </Typography>
      <Typography variant="body1" paragraph>
        - To Provide and Improve Services: To deliver our services, enhance user experience, and resolve issues.
        <br />
        - To Communicate with You: To send you updates, notifications, and respond to your inquiries.
        <br />
        - For Analytics: To analyze app usage and performance to make improvements.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. How We Share Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We do not sell or rent your personal information. We may share your information in the following circumstances:
      </Typography>
      <Typography variant="body1" paragraph>
        - Service Providers: We may share information with third-party service providers who assist us in operating our app and providing services.
        <br />
        - Legal Requirements: We may disclose your information if required to do so by law or to protect our rights and safety.
        <br />
        - Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We implement reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Your Choices
      </Typography>
      <Typography variant="body1" paragraph>
        You have the following choices regarding your personal information:
      </Typography>
      <Typography variant="body1" paragraph>
        - Access and Update: You can access and update your account information through your profile settings.
        <br />
        - Opt-Out: You can opt out of receiving promotional communications from us by following the instructions in those communications.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Children's Privacy
      </Typography>
      <Typography variant="body1" paragraph>
        Our app is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our app and updating the effective date. We encourage you to review this Privacy Policy periodically.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
      </Typography>
      <Typography variant="body1" paragraph>
        Email: princengwakomashumu
      </Typography>
    </Box>
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
          <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Terms and Conditions
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to [Your App Name]! These Terms and Conditions govern your use of our app. By accessing or using our app, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our app.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Use of Our App
      </Typography>
      <Typography variant="body1" paragraph>
        You may use our app only for lawful purposes and in accordance with these Terms and Conditions. You agree not to:
      </Typography>
      <Typography variant="body1" paragraph>
        - Use the app in any way that violates any applicable local, national, or international law.
        <br />
        - Interfere with or disrupt the operation of the app or servers.
        <br />
        - Attempt to gain unauthorized access to any part of the app or any systems or networks connected to it.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Account Responsibility
      </Typography>
      <Typography variant="body1" paragraph>
        If you create an account on our app, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Intellectual Property
      </Typography>
      <Typography variant="body1" paragraph>
        All content, features, and functionality on the app are the exclusive property of [Your App Name] and its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content from our app without our express written permission.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Disclaimer of Warranties
      </Typography>
      <Typography variant="body1" paragraph>
        Our app is provided on an "as is" and "as available" basis. We make no warranties or representations about the accuracy, reliability, or completeness of the app or its content. We disclaim all warranties, whether express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        In no event shall Shopping List App, its affiliates, or its licensors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the app, whether based on contract, tort, strict liability, or otherwise, even if we have been advised of the possibility of such damages.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Changes to the Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms and Conditions on our app and updating the effective date. You are advised to review these terms periodically for any changes.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Termination
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to terminate or suspend your access to our app at any time, without prior notice, for any reason, including but not limited to violation of these Terms and Conditions.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about these Terms and Conditions, please contact us at:
      </Typography>
      <Typography variant="body1" paragraph>
        Email: princengwakomashumu
      </Typography>
    </Box>
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
