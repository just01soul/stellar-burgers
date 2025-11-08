import { TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

export interface IngredientsState {
  isLoad: boolean;
  ingredients: TIngredient[];
  ingredientsError: string | null;
}

export const initialState: IngredientsState = {
  isLoad: false,
  ingredients: [],
  ingredientsError: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsStateSelector: (state) => state,
    ingredientsDataSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoad = true;
        state.ingredientsError = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.ingredientsError = action.error.message as string;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.ingredients = action.payload;
        state.ingredientsError = null;
      });
  }
});

export default ingredientsSlice.reducer;
export const { ingredientsStateSelector, ingredientsDataSelector } =
  ingredientsSlice.selectors;
