import { TConstructorIngredient, TOrder } from '@utils-types';
import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export interface ConstructorState {
  isLoad: boolean;
  constructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  constructorError: string | null;
}

const initialState: ConstructorState = {
  isLoad: false,
  constructor: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  constructorError: null
};

export const createBurgerThunk = createAsyncThunk(
  'constructorbg/createBurger',

  async (data: string[]) => await orderBurgerApi(data)
);

export const constructorSlice = createSlice({
  name: 'constructorbg',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructor.bun = action.payload;
        } else {
          state.constructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, id: key } };
      }
    },
    removeIngredient: (state, action) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ingredient) => ingredient.id != action.payload.id
      );
    },
    moveDownIngredient: (state, action) => {
      [
        state.constructor.ingredients[action.payload],
        state.constructor.ingredients[action.payload + 1]
      ] = [
        state.constructor.ingredients[action.payload + 1],
        state.constructor.ingredients[action.payload]
      ];
    },
    moveUpIngredient: (state, action) => {
      [
        state.constructor.ingredients[action.payload],
        state.constructor.ingredients[action.payload - 1]
      ] = [
        state.constructor.ingredients[action.payload - 1],
        state.constructor.ingredients[action.payload]
      ];
    },
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBurgerThunk.pending, (state) => {
        state.isLoad = true;
        state.orderRequest = true;
        state.constructorError = null;
      })
      .addCase(createBurgerThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.orderRequest = false;
        state.constructorError = action.error.message as string;
      })
      .addCase(createBurgerThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.constructor = {
          bun: null,
          ingredients: []
        };
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorError = null;
      });
  },
  selectors: {
    constructorStateSelector: (state) => state,
    constructorDataSelector: (state) => state.constructor,
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData
  }
});

export { initialState as constructorInitialState };
export default constructorSlice.reducer;
export const {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  setOrderRequest,
  clearOrderModalData
} = constructorSlice.actions;
export const {
  constructorStateSelector,
  constructorDataSelector,
  orderRequestSelector,
  orderModalDataSelector
} = constructorSlice.selectors;
