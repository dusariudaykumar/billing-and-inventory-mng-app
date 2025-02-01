import { PayloadAction } from './../../node_modules/@reduxjs/toolkit/src/createAction';
import { User } from '@/interfaces/response.interface';
import { getFromLocalStorage } from '@/lib/helper';
import { RootState } from '@/store';
import { authApi } from '@/store/services/auth';
import { createSlice } from '@reduxjs/toolkit';

interface AuthInitialState {
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthInitialState = {
  user: JSON.parse(getFromLocalStorage('srd-user') || '{}') || null,
  loading: false,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    updateUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      localStorage.setItem('srd-user', JSON.stringify(payload));
      state.isAuthenticated = true;
    },
    updateAuthLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {} as User;
      state.loading = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        return updateUserInfo(state, payload?.data);
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyUser.matchPending,
      (state, {}) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyUser.matchFulfilled,
      (state, { payload }) => {
        return updateUserInfo(state, payload?.data);
      }
    );

    builder.addMatcher(authApi.endpoints.verifyUser.matchRejected, (state) => {
      return resetUserInfo(state);
    });

    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      return resetUserInfo(state);
    });
  },
});

export const getUserData = (state: RootState) => state.authSlice;

const updateUserInfo = (
  state: AuthInitialState,
  userInfo: User | undefined
) => {
  localStorage.setItem('srd-user', JSON.stringify(userInfo));
  return {
    ...state,
    user: userInfo || ({} as User),
    isAuthenticated: true,
    loading: false,
  };
};

const resetUserInfo = (state: AuthInitialState) => {
  return {
    ...state,
    user: {} as User,
    isAuthenticated: false,
    loading: false,
  };
};
