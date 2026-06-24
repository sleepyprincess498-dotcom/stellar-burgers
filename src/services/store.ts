import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { authSlice } from '../slices/authSlice';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { ordersSlice } from '../slices/ordersSlice';
import { constructorSlice } from '../slices/constructorSlice';

const rootReducer = {
  ingredients: ingredientsSlice.reducer,
  orders: ordersSlice.reducer,
  auth: authSlice.reducer,
  burgerConstructor: constructorSlice.reducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
