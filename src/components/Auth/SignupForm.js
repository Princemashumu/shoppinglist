import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/authSlice';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';
import bgImage from '../../components/bg.jpg';

const SignupForm = () => {
  const [showSignup, setShowSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const userId = uuidv4();
    const newUser = { id: userId, email, password };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const savedUser = await response.json();
        dispatch(loginSuccess(savedUser));
        alert('Signup Successful!');
        setShowSignup(false);
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);

      if (response.ok) {
        const users = await response.json();
        if (users.length > 0) {
          dispatch(loginSuccess(users[0]));
          alert('Login Successful!');
          navigate('./HomePage');
        } else {
          alert('Invalid email or password.');
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={showSignup ? handleSignup : handleLogin} className="form">
        <h2>{showSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{showSignup ? 'Sign Up' : 'Login'}</button>

        <p>
          {showSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setShowSignup(!showSignup)}
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
