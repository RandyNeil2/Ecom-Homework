import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(
  selectUserState,
  (state) => ({
    id: state.id,
    username: state.username,
    email: state.email,
    fullName: state.fullName,
    phone: state.phone,
    defaultAddress: state.defaultAddress,
    preferences: state.preferences
  })
);

export const selectUserPreferences = createSelector(
  selectUserState,
  (state) => state.preferences
);

export const selectDefaultMinRating = createSelector(
  selectUserPreferences,
  (preferences) => preferences.defaultMinRating
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectUserId = createSelector(
  selectUserState,
  (state) => state.id
);

export const selectUserEmail = createSelector(
  selectUserState,
  (state) => state.email
);

export const selectUserFullName = createSelector(
  selectUserState,
  (state) => state.fullName
);

export const selectDefaultAddress = createSelector(
  selectUserState,
  (state) => state.defaultAddress
);
