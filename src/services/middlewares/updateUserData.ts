import { TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const updateUserData = createAsyncThunk(
  'updateUserData',
  async (data: TRegisterData) => {
    const response = await updateUserApi(data);
    return response;
  }
);
