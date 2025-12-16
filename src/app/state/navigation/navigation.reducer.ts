import { createReducer, on } from '@ngrx/store';
import * as NavigationActions from './navigation.actions';

export interface NavigationState {
  items: NavigationActions.NavigationItem[];
}

export const initialState: NavigationState = {
  items: [
    { path: '/', label: 'Home', icon: 'home', showWhenLoggedOut: true },
    { path: '/shop/products', label: 'Shop', icon: 'shopping_bag' },
  ],
};

export const navigationReducer = createReducer(
  initialState,
  on(NavigationActions.loadNavigationItems, (state) => state)
);

