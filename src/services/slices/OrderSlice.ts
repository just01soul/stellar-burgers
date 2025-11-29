import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';

export interface OrderState {
  isLoad: boolean;
  orders: TOrder[];
  order: TOrder | null;
  orderError: string | null; // Ошибка в заказе
}

const initialState: OrderState = {
  isLoad: false,
  orders: [],
  order: null,
  orderError: null
};

export const getOrdersThunk = createAsyncThunk('feed/get-orders', getOrdersApi);

export const getOrderThunk = createAsyncThunk(
  'feed/get-order',

  async (number: number) => await getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoad = true;
        state.orderError = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.orderError = action.error.message as string;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.orders = action.payload;
        state.orderError = null;
      })
      .addCase(getOrderThunk.pending, (state) => {
        state.isLoad = true;
        state.orderError = null;
      })
      .addCase(getOrderThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.orderError = action.error.message as string;
      })
      .addCase(getOrderThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.orderError = null;
        state.order = action.payload.orders[0];
      });
  },
  selectors: {
    ordersStateSelector: (state) => state,
    ordersDataSelector: (state) => state.orders,
    orderDataSelector: (state) => state.order
  }
});

export { initialState as orderInitialState };
export default orderSlice.reducer;
export const { ordersStateSelector, ordersDataSelector, orderDataSelector } =
  orderSlice.selectors;
