import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Pinterest } from '@mui/icons-material';

function Footer() {
  return (
    <Box 
    sx={{ 
      position: 'fixed', // Fixes the footer at the bottom of the viewport
      bottom: 0, // Positions it at the bottom
      left: '10px',
      right:'10px',
      width: 'calc(100% - 20px)',// Ensures the footer spans the entire width of the viewport
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
      p: 0, // Padding around content
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column',
      overflow:'hidden',
      boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow to separate from content
      zIndex: 1300 // Ensures the footer stays above other content
    }}
  >
      <Typography variant="body1" color="white" sx={{ mb: 2 }}>
        Follow us on
      </Typography>
      <Box>
        <IconButton href="https://www.facebook.com" target="_blank" aria-label="facebook">
          <Facebook sx={{ color: '#3b5998' }} />
        </IconButton>
        <IconButton href="https://www.twitter.com" target="_blank" aria-label="twitter">
          <Twitter sx={{ color: '#00acee' }} />
        </IconButton>
        <IconButton href="https://www.pinterest.com" target="_blank" aria-label="pinterest">
          <Pinterest sx={{ color: '#E60023' }} />
        </IconButton>
      </Box>
      <Typography variant="body2" color="white" sx={{ mt: 2 }}>
        © 2024 ShopList. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
