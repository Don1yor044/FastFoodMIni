import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OrdersState {
  orders: string[];
}

const initialState: OrdersState = {
  orders: [],
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<string[]>) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = OrdersSlice.actions;

export default OrdersSlice.reducer;
