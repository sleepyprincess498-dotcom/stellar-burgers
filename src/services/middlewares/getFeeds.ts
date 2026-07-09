import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeeds = createAsyncThunk('getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});
