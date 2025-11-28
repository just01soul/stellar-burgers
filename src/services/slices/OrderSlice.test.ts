import reducer, { 
  orderInitialState,
  getOrdersThunk,
  getOrderThunk 
} from './OrderSlice';

describe('Экшены для getOrdersThunk (получение списка заказов)', () => {
  describe('Вызов экшена Request', () => {
    const action = { type: getOrdersThunk.pending.type }

    test('isLoad имеет значение true, а старые ошибки сбрасываются', () => {
      const startState = {
        ...orderInitialState,
        orderError: 'Предыдущая ошибка'
      };
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(true);
      expect(newState.orderError).toBe(null);
    });

    test('orders и order не должны изменяться', () => {
      const stateData = {
        ...orderInitialState,
        orders: [
          {
            _id: '1',
            number: 1,
            name: 'Заказ-1',
            status: 'done',
            ingredients: [],
            createdAt: '2025/12/12',
            updatedAt: '2025/12/12'
          }
        ],
        order:{
          _id: '2',
          number: 2,
          name: 'Заказ-2',
          status: 'done',
          ingredients: [],
          createdAt: '2025/10/12',
          updatedAt: '2025/10/12'
        }
      };
      const newState = reducer(stateData, action);

      expect(newState.orders).toEqual(stateData.orders);
      expect(newState.order).toEqual(stateData.order);
    });
  });

  describe('Вызов экшена Success', () => {
    const mockOrders = [
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
    ];
    const startState = {
      ...orderInitialState,
      isLoad: true
    };
    const action = { 
      type: getOrdersThunk.fulfilled.type, 
      payload: mockOrders 
    };

    test('isLoad имеет значение false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('Данные orders должны записаться в стор', () => {
      const newState = reducer(orderInitialState, action);

      expect(newState.orders).toEqual(mockOrders);
      expect(newState.orders).toHaveLength(2);
      expect(newState.orders[0].name).toBe('Заказ 1');
      expect(newState.orders[1].name).toBe('Заказ 2');
    });

    test('orderError должен сбрасываться в null', () => {
      const errorState = {
        ...startState,
        orderError: 'Предыдущая ошибка',
      };
      const newState = reducer(errorState, action);

      expect(newState.orderError).toBe(null);
    });

    test('order не должен изменяться', () => {
      const stateOrder = {
        ...startState,
        order:{
          _id: '2',
          number: 2,
          name: 'Заказ-2',
          status: 'done',
          ingredients: [],
          createdAt: '2025/10/12',
          updatedAt: '2025/10/12'
        }
      };
      const newState = reducer(stateOrder, action);

      expect(newState.order).toEqual(stateOrder.order);
    });

    test('Существующие данные orders должны заменяться', () => {
      const stateOldData = {
        ...startState,
        orders: [
          {
            _id: 'Старый',
            number: 1111,
            name: 'Старый заказ',
            status: 'done',
            ingredients: [],
            createdAt: '2025/01/01',
            updatedAt: '2025/01/01'
          }
        ],
      };
      const newState = reducer(stateOldData, action);

      expect(newState.orders).toEqual(mockOrders);
      expect(newState.orders.find(order => order._id === 'Старый')).toBeUndefined();
    });
  });

  describe('Вызов экшена Failed', () => {
    const startState = {
      ...orderInitialState,
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
      order:{
        _id: '2',
        number: 2,
        name: 'Заказ-2',
        status: 'done',
        ingredients: [],
        createdAt: '2025/10/12',
        updatedAt: '2025/10/12'
      },
      isLoad: true
    };
    const action = { 
      type: getOrdersThunk.rejected.type,
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
      const newState = reducer(orderInitialState, errorAction);

      expect(newState.orderError).toBe(errorMessage);
    });
    
    test('существующие данные orders и order не должны изменяться', () => {
      const newState = reducer(startState, action);

      expect(newState.orders).toEqual(startState.orders);
      expect(newState.order).toEqual(startState.order);
    });
  })
});

describe('Экшены для getOrderThunk (получение заказа)', () => {
  describe('Вызов экшена Request', () => {
    const action = { type: getOrderThunk.pending.type }

    test('isLoad имеет значение true, а старые ошибки сбрасываются', () => {
      const startState = {
        ...orderInitialState,
        orderError: 'Предыдущая ошибка'
      };
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(true);
      expect(newState.orderError).toBe(null);
    });

    test('orders и order не должны изменяться', () => {
      const stateData = {
        ...orderInitialState,
        orders: [
          {
            _id: '1',
            number: 1,
            name: 'Заказ-1',
            status: 'done',
            ingredients: [],
            createdAt: '2025/12/12',
            updatedAt: '2025/12/12'
          }
        ],
        order:{
          _id: '2',
          number: 2,
          name: 'Заказ-2',
          status: 'done',
          ingredients: [],
          createdAt: '2025/10/12',
          updatedAt: '2025/10/12'
        }
      };
      const newState = reducer(stateData, action);

      expect(newState.orders).toEqual(stateData.orders);
      expect(newState.order).toEqual(stateData.order);
    });
  });

  describe('Вызов экшена Success', () => {
    const mockOrder = {
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
      ]
    }
    const startState = {
      ...orderInitialState,
      isLoad: true
    };
    const action = { 
      type: getOrderThunk.fulfilled.type, 
      payload: mockOrder
    };

    test('isLoad имеет значение false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('Данные order должны записаться в стор', () => {
      const newState = reducer(orderInitialState, action);

      expect(newState.order).toEqual(mockOrder.orders[0]);
      expect(newState.order!.name).toBe('Заказ 1');
      expect(newState.order!.number).toBe(1);
    });

    test('orderError должен сбрасываться в null', () => {
      const errorState = {
        ...startState,
        orderError: 'Предыдущая ошибка',
      };
      const newState = reducer(errorState, action);

      expect(newState.orderError).toBe(null);
    });

    test('orders не должны изменяться', () => {
      const stateOrders = {
        ...startState,
        orders:[
          {
            _id: '2',
            number: 2,
            name: 'Заказ-2',
            status: 'done',
            ingredients: [],
            createdAt: '2025/10/12',
            updatedAt: '2025/10/12'
          }
        ]
      };
      const newState = reducer(stateOrders, action);

      expect(newState.orders).toEqual(stateOrders.orders);
    });

    test('Существующие данные order должны заменяться', () => {
      const stateOldData = {
        ...startState,
        order: {
          _id: 'Старый',
          number: 1111,
          name: 'Старый заказ',
          status: 'done',
          ingredients: [],
          createdAt: '2025/01/01',
          updatedAt: '2025/01/01'
        }
      };
      const newState = reducer(stateOldData, action);

      expect(newState.order).toEqual(mockOrder.orders[0]);
      expect(newState.order!._id).toBe('1');
    });
  });

  describe('Вызов экшена Failed', () => {
    const startState = {
      ...orderInitialState,
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
      order: {
        _id: '2',
        number: 2,
        name: 'Заказ-2',
        status: 'done',
        ingredients: [],
        createdAt: '2025/10/12',
        updatedAt: '2025/10/12'
      },
      isLoad: true
    };
    const action = { 
      type: getOrderThunk.rejected.type,
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
      const newState = reducer(orderInitialState, errorAction);

      expect(newState.orderError).toBe(errorMessage);
    });
    
    test('существующие данные orders и order не должны изменяться', () => {
      const newState = reducer(startState, action);

      expect(newState.orders).toEqual(startState.orders);
      expect(newState.order).toEqual(startState.order);
    });
  })
})