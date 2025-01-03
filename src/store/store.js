// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from '../features/shoppingListSlice';
import authReducer from '../features/authSlice';

const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
    auth: authReducer,
  },
});

export default store;
