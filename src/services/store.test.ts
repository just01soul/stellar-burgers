import { expect, test } from '@jest/globals';
import { rootReducer } from './store';
import {
  constructorSlice,
  feedSlice,
  ingredientsSlice,
  orderSlice,
  userSlice
} from '@slices';

describe('Проверяем rootReducer', () => {
  test('Проверка правильной инициализации', () => {
    const initialState = rootReducer(undefined, { type: '@@redux/INIT' });

    expect(initialState).toEqual({
      user: userSlice.reducer(undefined, { type: '@@redux/INIT' }),
      order: orderSlice.reducer(undefined, { type: '@@redux/INIT' }),
      ingredients: ingredientsSlice.reducer(undefined, { type: '@@redux/INIT' }),
      constructorbg: constructorSlice.reducer(undefined, { type: '@@redux/INIT' }),
      feed: feedSlice.reducer(undefined, { type: '@@redux/INIT' })
    });
  });
});