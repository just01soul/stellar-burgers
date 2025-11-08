import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

export interface FeedsState {
  isLoad: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedError: string | null;
}

const initialState: FeedsState = {
  isLoad: false,
  orders: [],
  total: 0,
  totalToday: 0,
  feedError: null
};

export const getFeedsThunk = createAsyncThunk('feed/get-feeds', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isLoad = true;
        state.feedError = null;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.feedError = action.error.message as string;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.feedError = null;
      });
  },
  selectors: {
    feedStateSelector: (state) => state,
    feedDataSelector: (state) => state.orders,
    feedTotalSelector: (state) => state.total,
    feedTotalTodaySelector: (state) => state.totalToday
  }
});

export default feedSlice.reducer;
export const {
  feedStateSelector,
  feedDataSelector,
  feedTotalSelector,
  feedTotalTodaySelector
} = feedSlice.selectors;
