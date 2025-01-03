// src/features/shoppingListSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    items: [],
    categories: [], // New state for categories
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push({ ...action.payload, id: uuidv4() });
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload; // Action to set categories
    },
  },
});

export const { addItem, deleteItem, updateItem, setItems, setCategories } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
