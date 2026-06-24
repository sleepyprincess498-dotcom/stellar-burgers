import { TNewOrder } from '@api';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createOrder } from '../services/middlewares/createOrder';
import { getFeeds } from '../services/middlewares/getFeeds';
import { getOrderByNumber } from '../services/middlewares/getOrderByNumber';
import { getOrders } from '../services/middlewares/getOrders';

interface TOrderState {
  orders: TOrder[];
  newOrder: TNewOrder | null;
  personalOrders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TOrderState = {
  orders: [],
  newOrder: null,
  personalOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.newOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.orders = action.payload.orders),
          (state.total = action.payload.total),
          (state.totalToday = action.payload.totalToday);
      })
      .addCase(getFeeds.rejected, (state) => {
        (state.isLoading = false), (state.error = 'Ошибка загрузки заказов.');
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        (state.isLoading = false), (state.personalOrders = action.payload);
      })
      .addCase(getOrders.rejected, (state) => {
        (state.isLoading = false), (state.error = 'Ошибка загрузки заказов.');
      })

      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        (state.isLoading = false), (state.newOrder = action.payload.order);
      })
      .addCase(createOrder.rejected, (state) => {
        (state.isLoading = false), (state.error = 'Ошибка создания заказа.');
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.error = 'Ошибка! Заказ не найден.';
      });
  }
});

export const { clearOrder } = ordersSlice.actions;
