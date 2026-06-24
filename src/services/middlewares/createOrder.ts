import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const createOrder = createAsyncThunk(
  'createOrder',
  async (data: string[], { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuth = state.auth.isAuth;

    if (!isAuth) {
      return rejectWithValue('unAutorized');
    }

    const response = await orderBurgerApi(data);
    return response;
  }
);
