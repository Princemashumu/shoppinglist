import { configureStore } from '@reduxjs/toolkit';
import groceryReducer from '../redux/slices/grocerySlice';

const store = configureStore({
  reducer: {
    grocery: groceryReducer,
  },
});

export default store;
