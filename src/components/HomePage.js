import React from 'react';
import CustomAppBar from './CustomAppBar';
import Footer from './Footer';
import GroceryList from './GroceryList';
import { Box } from '@mui/material';
import backgroundImg from '../bg.jpg';


function HomePage() {
  return (
    <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      overflowX: 'hidden', // Prevent horizontal scrolling
      bgcolor: '#f5f5f5', // Background color for the entire page
      // backgroundImage: `url(${backgroundImg})`, // Background image
      backgroundSize: 'cover', // Cover the entire container
      backgroundPosition: 'center', // Center the background image
      backgroundRepeat: 'no-repeat', // Prevent repeating the background image
    }}
  >
      <CustomAppBar />
      <Box 
        sx={{ 
          flex: 1, // Ensures this section grows to take up available space
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: { xs: 4, sm: 6, md: 8 }, // Responsive top margin
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          width: '100%',
          overflowY: 'auto', // Enables vertical scrolling when content overflows
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: 800, md: 1200 }, // Responsive max width
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
          }}
        >
          <GroceryList />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          p: { xs: 2, sm: 4, md: 6 }, // Responsive padding
          textAlign: 'center',
          position:'static',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}

export default HomePage;
