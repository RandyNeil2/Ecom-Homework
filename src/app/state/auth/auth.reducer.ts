import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  access: string | null;
  refresh: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  access: null,
  refresh: null,
  user: null,
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

  on(AuthActions.loginSuccess, (state, { access, refresh, user }) => {
    // Persist to localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      ...state,
      access,
      refresh,
      user,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, (state) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return {
      ...state,
      access: null,
      refresh: null,
      user: null,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.loadAuthFromStorage, (state) => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userJson = localStorage.getItem('user');
    let user = null;
    
    try {
      if (userJson) {
        user = JSON.parse(userJson);
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }
    
    return {
      ...state,
      access,
      refresh,
      user,
    };
  })
);

