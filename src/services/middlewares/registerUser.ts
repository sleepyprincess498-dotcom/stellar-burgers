import { registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    return response;
  }
);
