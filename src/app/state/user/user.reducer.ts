import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  id: string | null;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  defaultAddress?: UserActions.Address;
  preferences: UserActions.UserPreferences;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  id: null,
  username: '',
  email: '',
  fullName: undefined,
  phone: undefined,
  defaultAddress: undefined,
  preferences: {
    newsletter: false,
    defaultMinRating: undefined
  },
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,

  // Load profile
  on(UserActions.loadUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    defaultAddress: user.defaultAddress,
    preferences: user.preferences,
    loading: false,
    error: null
  })),

  on(UserActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update profile
  on(UserActions.updateUserProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    defaultAddress: user.defaultAddress,
    preferences: user.preferences,
    loading: false,
    error: null
  })),

  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update preferences
  on(UserActions.updateUserPreferences, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserPreferencesSuccess, (state, { preferences }) => ({
    ...state,
    preferences: {
      ...state.preferences,
      ...preferences
    },
    loading: false,
    error: null
  })),

  on(UserActions.updateUserPreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear user on logout
  on(UserActions.clearUser, () => initialState)
);
