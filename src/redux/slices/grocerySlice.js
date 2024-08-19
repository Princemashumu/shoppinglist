import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Async thunks
export const fetchItems = createAsyncThunk('grocery/fetchItems', async () => {
  const [fruitVeg, meat, beverages, bathing] = await Promise.all([
    axios.get(`${API_URL}/fruitVeg`),
    axios.get(`${API_URL}/meat`),
    axios.get(`${API_URL}/beverages`),
    axios.get(`${API_URL}/bathing`),
  ]);
  return {
    fruitVeg: fruitVeg.data,
    meat: meat.data,
    beverages: beverages.data,
    bathing: bathing.data,
  };
});

export const addItem = createAsyncThunk('grocery/addItem', async ({ category, item }) => {
  const response = await axios.post(`${API_URL}/${category}`, item);
  return { category, item: response.data };
});

export const updateItem = createAsyncThunk('grocery/updateItem', async ({ category, id, item }) => {
  await axios.put(`${API_URL}/${category}/${id}`, item);
  return { category, id, item };
});

export const deleteItem = createAsyncThunk('grocery/deleteItem', async ({ category, id }) => {
  await axios.delete(`${API_URL}/${category}/${id}`);
  return { category, id };
});

// Initial state
const initialState = {
  fruitVeg: [],
  meat: [],
  beverages: [],
  bathing: [],
  titles: {
    fruitVeg: 'Fruit & Veg',
    meat: 'Meat',
    beverages: 'Beverages',
    bathing: 'Bathing',
  },
  loading: false,
  error: null,
};

// Slice
const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      const { category, title } = action.payload;
      state.titles[category] = title;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.fruitVeg = action.payload.fruitVeg;
        state.meat = action.payload.meat;
        state.beverages = action.payload.beverages;
        state.bathing = action.payload.bathing;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state[action.payload.category].push(action.payload.item);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const { category, id, item } = action.payload;
        const index = state[category].findIndex((i) => i.id === id);
        if (index !== -1) {
          state[category][index] = item;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { category, id } = action.payload;
        state[category] = state[category].filter((i) => i.id !== id);
      });
  },
});

export const { setTitle } = grocerySlice.actions;
export default grocerySlice.reducer;
