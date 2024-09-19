import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CategoriesState {
  categories: string[];
}

const initialState: CategoriesState = {
  categories: [],
};

const CategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;
