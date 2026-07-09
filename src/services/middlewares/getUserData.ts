import { getUserApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUser = createAsyncThunk('getUserData', async () => {
  const response = await getUserApi();
  return response;
});
