import { TUser } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isLoad: boolean;
  user: TUser | null; //null, если пользователь не авторизован
  isAuth: boolean;
  loginUserError: null | string; // Ошибка в логине
  isAuthChecked: boolean; // флаг для провекрки авторизации
}

const initialState: UserState = {
  isLoad: false,
  user: null,
  isAuth: false,
  loginUserError: null,
  isAuthChecked: false
};

export const loginUserThunk = createAsyncThunk(
  'user/login',

  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken); // устанавливаем accessToken
    localStorage.setItem('refreshToken', data.refreshToken); // устанавливаем refreshToken

    return data;
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',

  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',

  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken); // устанавливаем accessToken
    localStorage.setItem('refreshToken', data.refreshToken); // устанавливаем refreshToken

    return data.user;
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgot-password',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response;
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/reset-password',

  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

export const updateUserThunk = createAsyncThunk(
  'user/update',

  async (user: TUser) => await updateUserApi(user)
);

export const getUserThunk = createAsyncThunk(
  'user/get',

  async () => await getUserApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.loginUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.user = null;
        state.isAuth = false;
        state.loginUserError = null;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.loginUserError = null;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.loginUserError = null;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.loginUserError = null;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error.message as string;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.loginUserError = null;
        state.isAuthChecked = true;
      });
  },
  selectors: {
    userStateSelector: (state) => state,
    userDataSelector: (state) => state.user,
    isAuthSelector: (state) => state.isAuth,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    userErrorSelector: (state) => state.loginUserError
  }
});

export default userSlice.reducer;
export const { clearUserError } = userSlice.actions;
export const {
  userStateSelector,
  userDataSelector,
  isAuthSelector,
  isAuthCheckedSelector,
  userErrorSelector
} = userSlice.selectors;
