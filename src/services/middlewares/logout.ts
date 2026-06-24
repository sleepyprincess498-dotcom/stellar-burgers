import { logoutApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const logoutUser = createAsyncThunk('logoutUser', async () => {
  const response = await logoutApi();
  return response;
});
