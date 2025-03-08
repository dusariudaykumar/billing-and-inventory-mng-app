import { User } from '@/interfaces/response.interface';
import { getFromLocalStorage } from '@/lib/helper';
import { RootState } from '@/store';
import { authApi } from '@/store/services/auth';
import { createSlice } from '@reduxjs/toolkit';

interface AuthInitialState {
  user: User | null;
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
    logout: (state) => resetUserInfo(state),
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        return updateUserInfo(state, payload?.data);
      }
    );
    builder.addMatcher(authApi.endpoints.verifyUser.matchPending, (state) => {
      state.loading = true;
    });
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
export const { logout } = authSlice.actions;

const updateUserInfo = (
  state: AuthInitialState,
  userInfo: User | undefined
) => {
  localStorage.setItem('srd-user', JSON.stringify(userInfo));
  return {
    ...state,
    user: userInfo || null,
    isAuthenticated: true,
    loading: false,
  };
};

const resetUserInfo = (state: AuthInitialState) => {
  localStorage.clear();
  return {
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
  };
};
