import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface KorzinkaState {
  korzinka: string[];
}

const initialState: KorzinkaState = {
  korzinka: [],
};

const KorzinkaSlice = createSlice({
  name: "korzinka",
  initialState,
  reducers: {
    setKorzinka: (state, action: PayloadAction<string[]>) => {
      state.korzinka = action.payload;
    },
  },
});

export const { setKorzinka } = KorzinkaSlice.actions;

export default KorzinkaSlice.reducer;
