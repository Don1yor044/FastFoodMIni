import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  userId: string | number | null;
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        userId: string | number;
        token: string;
        username: string;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.username = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
