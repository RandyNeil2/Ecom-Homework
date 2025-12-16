import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NavigationState } from './navigation.reducer';

export const selectNavigationState = createFeatureSelector<NavigationState>('navigation');

export const selectAllNavigationItems = createSelector(
  selectNavigationState,
  (state) => state.items
);

export const selectPublicNavigationItems = createSelector(
  selectAllNavigationItems,
  (items) => items.filter(item => !item.requiresAuth)
);

export const selectAuthNavigationItems = (isLoggedIn: boolean) =>
  createSelector(selectAllNavigationItems, (items) =>
    items.filter((item) => {
      if (item.requiresAuth && !isLoggedIn) return false;
      if (item.showWhenLoggedIn && !isLoggedIn) return false;
      if (item.showWhenLoggedOut && isLoggedIn) return false;
      return true;
    })
  );

