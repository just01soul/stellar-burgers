import reducer, { 
  userInitialState,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  updateUserThunk,
  getUserThunk,
  clearUserError
} from './UserSlice';

describe('Экшены для loginUserThunk', () => {
  describe('Вызов экшена Request', () => {
    const startState = {
      ...userInitialState,
      loginUserError: 'Предыдущая ошибка'
    }
    const action = { type: loginUserThunk.pending.type };

    test('isLoad меняет значение на true', () => {
      const newState = reducer(userInitialState, action);

      expect(newState.isLoad).toBe(true);
    });

    test('loginUserError должен сбрасываться в null', () => {
      const newState = reducer(startState, action);

      expect(newState.loginUserError).toBe(null);
    });
  });

  describe('Вызов экшена Success', () => {
    const mockUserData = {
      user: {
        name: 'User',
        email: 'user@example.ru'
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };
    const startState = {
      ...userInitialState,
      isLoad: true
    };
    const action = { 
      type: loginUserThunk.fulfilled.type, 
      payload: mockUserData
    };

    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('user должен записываться в стор', () => {

      const newState = reducer(startState, action);

      expect(newState.user).toEqual(mockUserData.user);
      expect(newState.user!.name).toBe('User');
      expect(newState.user!.email).toBe('user@example.ru');
    });

    test('isAuth меняет значение на true', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuth).toBe(true);
    });

    test('loginUserError должен оставаться null', () => {
      const newState = reducer(startState, action);

      expect(newState.loginUserError).toBe(null);
    });
  });

  describe('Вызов экшена Failed', () => {
     const startState = {
        ...userInitialState,
        isLoad: true
      };
      const action = { 
        type: loginUserThunk.rejected.type,
        error: { message: 'Ошибка входа' }
      };

    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('loginUserError должен записываться в стор', () => {
      const errorMessage = 'Неверный email или пароль';
      const errorAction = { 
        ...action,
        error: { message: errorMessage }
      };
      const newState = reducer(startState, errorAction);

      expect(newState.loginUserError).toBe(errorMessage);
    });

    test('user и isAuth не должны изменяться', () => {
      const stateData = {
        ...startState,
        user: null,
        isAuth: false
      };
      const newState = reducer(stateData, action);

      expect(newState.user).toBe(null);
      expect(newState.isAuth).toBe(false);
    });
  });
});

describe('Экшены для logoutUserThunk', () => {
  describe('Вызов экшена Request', () => {
    test('isLoad меняет значение на true', () => {
      const action = { type: logoutUserThunk.pending.type };
      const newState = reducer(userInitialState, action);

      expect(newState.isLoad).toBe(true);
    });
  });

  describe('Вызов экшена Success', () => {
    const startState = {
      ...userInitialState,
      isLoad: true
    };
    const action = { 
      type: logoutUserThunk.fulfilled.type 
    };

    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('user должен сбрасываться в null, а isAuth меняет значение на false', () => {
      const stateUser = {
        ...startState,
        user: { name: 'User', email: 'user@example.ru' },
        isAuth: true
      };
      const newState = reducer(stateUser, action);

      expect(newState.user).toBe(null);
      expect(newState.isAuth).toBe(false);
    });

    test('loginUserError должен сбрасываться в null', () => {
      const stateError = {
        ...startState,
        loginUserError: 'Предыдущая ошибка'
      };
      const newState = reducer(stateError, action);

      expect(newState.loginUserError).toBe(null);
    });
  });

  describe('Вызов экшена Failed', () => {
    const startState = {
      ...userInitialState,
      isLoad: true
    };
    const action = { 
      type: logoutUserThunk.rejected.type,
      error: { message: 'Ошибка выхода' }
    };

    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('loginUserError должен записываться в стор', () => {
      const errorMessage = 'Ошибка при выходе';
      const errorAction = { 
        ...action,
        error: { message: errorMessage }
      };
      const newState = reducer(startState, errorAction);

      expect(newState.loginUserError).toBe(errorMessage);
    });
  });
});

describe('Экшены для registerUserThunk', () => {
  describe('Вызов экшена Success', () => {
    const mockUser = {
      name: 'User',
      email: 'user@example.ru'
    };
    const startState = {
      ...userInitialState,
      isLoad: true
    };

    const action = { 
      type: registerUserThunk.fulfilled.type, 
      payload: mockUser 
    };

    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('user должен записываться в стор', () => {
      const newState = reducer(startState, action);

      expect(newState.user).toEqual(mockUser);
    });

    test('isAuth меняет значение на true', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuth).toBe(true);
    });
  });
});

describe('Экшены для forgotPasswordThunk и resetPasswordThunk', () => {
  describe('Вызов экшена Success', () => {
    test('forgotPasswordThunk: isLoad меняет значение на false', () => {
      const loadingState = {
        ...userInitialState,
        isLoad: true
      };

      const action = { 
        type: forgotPasswordThunk.fulfilled.type 
      };
      const newState = reducer(loadingState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('resetPasswordThunk: isLoad меняет значение на false', () => {
      const loadingState = {
        ...userInitialState,
        isLoad: true
      };

      const action = { 
        type: resetPasswordThunk.fulfilled.type 
      };
      const newState = reducer(loadingState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('loginUserError должен сбрасываться в null', () => {
      const stateWithError = {
        ...userInitialState,
        loginUserError: 'Предыдущая ошибка',
        isLoad: true
      };

      const action = { 
        type: forgotPasswordThunk.fulfilled.type 
      };
      const newState = reducer(stateWithError, action);

      expect(newState.loginUserError).toBe(null);
    });
  });
});

describe('Экшены для updateUserThunk', () => {
  describe('Вызов экшена Success', () => {
    const mockUpdatedUser = {
      user: {
        name: 'Updated User',
        email: 'updated@example.com'
      }
    };

    test('isLoad меняет значение на false', () => {
      const loadingState = {
        ...userInitialState,
        isLoad: true
      };

      const action = { 
        type: updateUserThunk.fulfilled.type, 
        payload: mockUpdatedUser 
      };
      const newState = reducer(loadingState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('user должен обновляться', () => {
      const stateWithUser = {
        ...userInitialState,
        user: { name: 'Old User', email: 'old@example.com' }
      };

      const action = { 
        type: updateUserThunk.fulfilled.type, 
        payload: mockUpdatedUser 
      };
      const newState = reducer(stateWithUser, action);

      expect(newState.user).toEqual(mockUpdatedUser.user);
    });

    test('isAuth должен оставаться true', () => {
      const stateWithAuth = {
        ...userInitialState,
        isAuth: true
      };

      const action = { 
        type: updateUserThunk.fulfilled.type, 
        payload: mockUpdatedUser 
      };
      const newState = reducer(stateWithAuth, action);

      expect(newState.isAuth).toBe(true);
    });
  });
});

describe('Экшены для getUserThunk', () => {
  describe('Вызов экшена Success', () => {
    const mockUserData = {
      user: {
        name: 'User',
        email: 'user@example.ru'
      }
    };
    const startState = {
      ...userInitialState,
      isLoad: true
    };
    const action = { 
      type: getUserThunk.fulfilled.type, 
      payload: mockUserData 
    };
    test('isLoad меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isLoad).toBe(false);
    });

    test('user должен записываться в стор', () => {
      const newState = reducer(startState, action);

      expect(newState.user).toEqual(mockUserData.user);
    });

    test('isAuth меняет значение на true', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuth).toBe(true);
    });

    test('isAuthChecked меняет значение на true', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('Вызов экшена Failed', () => {
     const startState = {
        ...userInitialState,
        isAuth: true
      };
    const action = { 
      type: getUserThunk.rejected.type,
      error: { message: 'Ошибка получения пользователя' }
    };
    
    test('isAuthChecked меняет значение на true', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuthChecked).toBe(true);
    });

    test('isAuth меняет значение на false', () => {
      const newState = reducer(startState, action);

      expect(newState.isAuth).toBe(false);
    });
  });
});

describe('Редьюсер clearUserError', () => {
  const startState = {
      ...userInitialState,
      loginUserError: 'Какая-то ошибка'
    };

  test('должен сбрасывать loginUserError в null', () => {
    const newState = reducer(startState, clearUserError());

    expect(newState.loginUserError).toBe(null);
  });

  test('не должен изменять другие поля состояния', () => {
    const state = {
      ...startState,
      user: { name: 'Test', email: 'test@example.com' },
      isAuth: true,
      isLoad: false,
      loginUserError: 'Ошибка',
      isAuthChecked: true
    };

    const newState = reducer(state, clearUserError());

    expect(newState.user).toEqual(state.user);
    expect(newState.isAuth).toBe(state.isAuth);
    expect(newState.isLoad).toBe(state.isLoad);
    expect(newState.isAuthChecked).toBe(state.isAuthChecked);
    expect(newState.loginUserError).toBe(null);
  });
});
