// src/slices/salesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDataFromApi, deleteData } from '../utils/api';

// Thunk to fetch sales data
export const fetchSales = createAsyncThunk('sales/fetchSales', async () => {
  const response = await fetchDataFromApi('/api/sales');
  return response;
});

// Thunk to delete a sale
export const deleteSale = createAsyncThunk('sales/deleteSale', async (id) => {
  await deleteData(`/api/sales/${id}`);
  return id;
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.items = state.items.filter((sale) => sale._id !== action.payload);
      });
  },
});

export default salesSlice.reducer;
