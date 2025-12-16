import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  access: string | null;
  refresh: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  access: null,
  refresh: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { access, refresh }) => ({
    ...state,
    access,
    refresh,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, (state) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return {
      ...state,
      access: null,
      refresh: null,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.loadAuthFromStorage, (state) => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    return {
      ...state,
      access,
      refresh,
    };
  })
);
