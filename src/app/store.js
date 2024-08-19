import { configureStore } from '@reduxjs/toolkit';
import groceryReducer from '../redux/slices/grocerySlice';
import authReducer from '../redux/slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    grocery: groceryReducer,
  },
});

export default store;