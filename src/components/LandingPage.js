import React, { useState } from 'react';
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
import logo from '../logo.png'; // Adjust the path if necessary
import Footer from './Footer';

function LandingPage() {
  const [signUpData, setSignUpData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
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
            {/* <Button
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
            </Button> */}
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
              <img src={logo} alt="Loading..." style={{ width: '50px', height: '50px' }} />
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

      <Dialog
        open={privacyDialogOpen}
        onClose={() => setPrivacyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            **Privacy Policy**
            <br />
            <br />
            **1. Introduction**
            <br />
            Welcome to List App ("we", "our", "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. By using our services, you agree to the collection and use of information in accordance with this policy.
            <br />
            <br />
            **2. Information Collection**
            <br />
            We may collect and process the following types of information:
            <br />
            - **Personal Data**: Name, email address, phone number, etc.
            <br />
            - **Usage Data**: Information about your interaction with our services, including IP address, browser type, and pages visited.
            <br />
            - **Cookies and Tracking Technologies**: We use cookies to track your activity and preferences.
            <br />
            <br />
            **3. Use of Information**
            <br />
            We use the collected information to:
            <br />
            - Provide and maintain our services
            <br />
            - Improve user experience and service functionality
            <br />
            - Communicate with you, including for updates and promotional purposes
            <br />
            - Analyze usage trends and conduct research
            <br />
            <br />
            **4. Data Sharing and Disclosure**
            <br />
            We do not sell your personal information. However, we may share your information:
            <br />
            - With third-party service providers who assist us in operating our services
            <br />
            - In compliance with legal obligations or to protect our rights
            <br />
            - During business transactions such as mergers or acquisitions
            <br />
            <br />
            **5. Data Security**
            <br />
            We implement reasonable measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
            <br />
            <br />
            **6. Your Rights**
            <br />
            You have the right to access, correct, or delete your personal data. You can also object to processing or request restriction of processing.
            <br />
            <br />
            **7. Changes to This Policy**
            <br />
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website. Please review this policy periodically for any changes.
            <br />
            <br />
            **8. Contact Us**
            <br />
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            - Email: [princengwakomashumu@gmail]
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            **Terms and Conditions**
            <br />
            <br />
            **1. Introduction**
            <br />
            These Terms and Conditions ("Terms") govern your use of List App ("we", "our", "us"). By accessing or using our services, you agree to comply with these Terms.
            <br />
            <br />
            **2. Use of Services**
            <br />
            You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:
            <br />
            - Violate any applicable laws or regulations
            <br />
            - Engage in any activity that disrupts or damages our services
            <br />
            - Attempt to gain unauthorized access to our systems
            <br />
            <br />
            **3. User Accounts**
            <br />
            To use certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            <br />
            <br />
            **4. Intellectual Property**
            <br />
            All content and materials provided through our services are owned by us or licensed to us. You may not reproduce, distribute, or create derivative works from our content without our permission.
            <br />
            <br />
            **5. Limitation of Liability**
            <br />
            Our services are provided "as is" and we make no warranties of any kind, either express or implied. We are not liable for any damages arising from the use or inability to use our services.
            <br />
            <br />
            **6. Indemnification**
            <br />
            You agree to indemnify and hold us harmless from any claims, damages, liabilities, and expenses arising from your use of our services or violation of these Terms.
            <br />
            <br />
            **7. Termination**
            <br />
            We may terminate or suspend your access to our services at any time, with or without cause, and without prior notice.
            <br />
            <br />
            **8. Changes to These Terms**
            <br />
            We may update these Terms from time to time. Any changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes your acceptance of the new Terms.
            <br />
            <br />
            **9. Governing Law**
            <br />
            These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts located in [Your Jurisdiction].
            <br />
            <br />
            **10. Contact Us**
            <br />
            If you have any questions about these Terms, please contact us at:
            <br />
            - Email: [princengwakomashumu@gmail.com]
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}

export default LandingPage;
