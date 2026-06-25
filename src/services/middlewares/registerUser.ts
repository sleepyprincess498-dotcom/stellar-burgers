import { registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);
