import { createAction, props } from '@ngrx/store';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
}

// Load user profile
export const loadUserProfile = createAction('[User] Load User Profile');

export const loadUserProfileSuccess = createAction(
  '[User] Load User Profile Success',
  props<{ user: UserProfile }>()
);

export const loadUserProfileFailure = createAction(
  '[User] Load User Profile Failure',
  props<{ error: string }>()
);

// Update user profile
export const updateUserProfile = createAction(
  '[User] Update User Profile',
  props<{ updates: Partial<UserProfile> }>()
);

export const updateUserProfileSuccess = createAction(
  '[User] Update User Profile Success',
  props<{ user: UserProfile }>()
);

export const updateUserProfileFailure = createAction(
  '[User] Update User Profile Failure',
  props<{ error: string }>()
);

// Update preferences
export const updateUserPreferences = createAction(
  '[User] Update User Preferences',
  props<{ preferences: Partial<UserPreferences> }>()
);

export const updateUserPreferencesSuccess = createAction(
  '[User] Update User Preferences Success',
  props<{ preferences: UserPreferences }>()
);

export const updateUserPreferencesFailure = createAction(
  '[User] Update User Preferences Failure',
  props<{ error: string }>()
);

// Clear user on logout
export const clearUser = createAction('[User] Clear User');
