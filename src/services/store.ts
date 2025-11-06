import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  constructorSlice,
  feedSlice,
  ingredientsSlice,
  orderSlice,
  userSlice
} from '@slices';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  constructorbg: constructorSlice.reducer,
  feed: feedSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
