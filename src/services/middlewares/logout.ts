import { logoutApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie } from '../../utils/cookie';

export const logoutUser = createAsyncThunk('logoutUser', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return response;
});
