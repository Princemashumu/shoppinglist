import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from '../features/shoppingList/shoppingListSlice';

export const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
  },
});