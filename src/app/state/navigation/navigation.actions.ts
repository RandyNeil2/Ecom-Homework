import { createAction, props } from '@ngrx/store';

export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
  showWhenLoggedIn?: boolean;
  showWhenLoggedOut?: boolean;
}

export const loadNavigationItems = createAction('[Navigation] Load Navigation Items');

