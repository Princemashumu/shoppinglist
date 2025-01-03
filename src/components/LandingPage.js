import React from 'react';
import SignupForm from '../components/Auth/SignupForm';
import './LandingPage.css';
import Navbar from '../components/Navbar'; // Adjusted import path

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    
    <div className="landing-page-container">
      
      <div className="landing-page-forms">
        <SignupForm />
      </div>
    </div>
    </>
  );
};

export default LandingPage;
