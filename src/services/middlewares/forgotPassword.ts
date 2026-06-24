import { forgotPasswordApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const forgotPassword = createAsyncThunk(
  'forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);
