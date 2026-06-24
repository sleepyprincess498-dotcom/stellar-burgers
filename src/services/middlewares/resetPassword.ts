import { resetPasswordApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const resetPassword = createAsyncThunk(
  'resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response;
  }
);
