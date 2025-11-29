import reducer, { 
  feedInitialState,
  getFeedsThunk 
} from './FeedSlice';

describe('Вызов экшена Request', () => {
  const action = { type: getFeedsThunk.pending.type }
  test('isLoad имеет значение true, а старые ошибки сбрасываются', () => {
    const startState = {
      ...feedInitialState,
      feedError: 'Предыдущая ошибка'
    };
    const newState = reducer(startState, action);

    expect(newState.isLoad).toBe(true);
    expect(newState.feedError).toBe(null);
  });

  test('Данные заказа не должны изменяться', () => {
    const stateData = {
      ...feedInitialState,
      orders: [
        { _id: '1', number: 1, name: 'Заказ', status: 'done', ingredients: [], createdAt: '2025/12/12', updatedAt: '2025/12/12' }
      ],
      total: 100,
      totalToday: 10
    };
    const newState = reducer(stateData, action);

    expect(newState.orders).toEqual(stateData.orders);
    expect(newState.total).toBe(100);
    expect(newState.totalToday).toBe(10);
  });
});

describe('Вызов экшена Success', () => {
  const mockFeed = {
    orders: [
      {
        _id: '1',
        number: 1,
        name: 'Заказ 1',
        status: 'done',
        ingredients: ['Ингредиент 1-1', 'Ингредиент 1-2'],
        createdAt: '2025/12/12',
        updatedAt: '2025/12/12'
      },
      {
        _id: '2', 
        number: 2,
        name: 'Заказ 2',
        status: 'pending',
        ingredients: ['Ингредиент 2-1', 'Ингредиент 2-2'],
        createdAt: '2025/12/13',
        updatedAt: '2025/12/13'
      }
    ],
    total: 300,
    totalToday: 30
  };
  const startState = {
    ...feedInitialState,
    isLoad: true
  };
  const action = { 
    type: getFeedsThunk.fulfilled.type, 
    payload: mockFeed 
  };

  test('isLoad имеет значение false', () => {
    const newState = reducer(startState, action);

    expect(newState.isLoad).toBe(false);
  });

  test('Данные заказа должны записаться в стор', () => {
    const newState = reducer(feedInitialState, action);

    expect(newState.orders).toEqual(mockFeed.orders);
    expect(newState.orders).toHaveLength(2);
    expect(newState.orders[0].name).toBe('Заказ 1');
    expect(newState.orders[1].name).toBe('Заказ 2');
    expect(newState.total).toBe(300);
    expect(newState.totalToday).toBe(30);
  });

  test('feedError должен сбрасываться в null', () => {
    const errorState = {
      ...startState,
      feedError: 'Предыдущая ошибка',
    };
    const newState = reducer(errorState, action);

    expect(newState.feedError).toBe(null);
  });

   test('Существующие данные должны заменяться', () => {
    const stateOldData = {
      ...feedInitialState,
      orders: [
        { _id: 'Старый', number: 1111, name: 'Старый заказ', status: 'done', ingredients: [], createdAt: '2025/01/01', updatedAt: '2025/01/01' }
      ],
      total: 500,
      totalToday: 50
    };
    const newState = reducer(stateOldData, action);

    expect(newState.orders).toEqual(mockFeed.orders);
    expect(newState.total).toBe(300);
    expect(newState.totalToday).toBe(30);
    expect(newState.orders.find(order => order._id === 'Старый')).toBeUndefined();
  });
});

describe('Вызов экшена Failed', () => {
  const startState = {
    ...feedInitialState,
    orders: [
      {
        _id: '1',
        number: 1,
        name: 'Заказ 1',
        status: 'done',
        ingredients: ['Ингредиент 1-1', 'Ингредиент 1-2'],
        createdAt: '2025/12/12',
        updatedAt: '2025/12/12'
      }
    ],
    total: 100,
    totalToday: 10,
    isLoad: true
  };
  const action = { 
    type: getFeedsThunk.rejected.type,
    error: { message: 'Ошибка загрузки' }
  };

  test('isLoad имеет значение false', () => {
    const newState = reducer(startState, action);

    expect(newState.isLoad).toBe(false);
  });

  test('Ошибка должна записаться в стор', () => {
    const errorMessage = 'Network error: Failed to fetch';
    const errorAction = { 
      ...action,
      error: { message: errorMessage }
    };
    const newState = reducer(feedInitialState, errorAction);

    expect(newState.feedError).toBe(errorMessage);
  });
  
  test('существующие данные заказа не должны изменяться', () => {
    const newState = reducer(startState, action);

    expect(newState.orders).toEqual(startState.orders);
    expect(newState.total).toBe(100);
    expect(newState.totalToday).toBe(10);
  });
})