import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getOrders = createAsyncThunk('getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});
