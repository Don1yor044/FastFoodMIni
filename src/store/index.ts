import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slice/productsSlice";
import ordersReducer from "./slice/orderSlice";
import categoriesReducer from "./slice/categoriesSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    categories: categoriesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
