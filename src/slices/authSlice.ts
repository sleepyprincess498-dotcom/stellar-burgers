import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { forgotPassword } from '../services/middlewares/forgotPassword';
import { getUser } from '../services/middlewares/getUserData';
import { loginUser } from '../services/middlewares/loginUser';
import { logoutUser } from '../services/middlewares/logout';
import { registerUser } from '../services/middlewares/registerUser';
import { resetPassword } from '../services/middlewares/resetPassword';
import { updateUserData } from '../services/middlewares/updateUserData';

interface TAuthState {
  user: null | TUser;
  token: null | string;
  isLoading: boolean;
  isAuthChecked: boolean;
  isAuth: boolean;
  error: null | string;
}

const initialState: TAuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthChecked: false,
  isAuth: false,
  error: null
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка регистрации';
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка! Пароль не отправлен.';
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка! Пароль не изменён.';
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка!';
        state.isAuthChecked = true;
      })

      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserData.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка!';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.error = 'Ошибка!';
      });
  }
});

export const { setAuthChecked } = authSlice.actions;
