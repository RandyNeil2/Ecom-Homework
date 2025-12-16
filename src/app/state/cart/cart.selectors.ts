import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (state) => state.items);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0)
);

export const selectPromoCode = createSelector(selectCartState, (state) => state.promoCode);
export const selectDiscount = createSelector(selectCartState, (state) => state.discount);

export const selectTotalWithDiscount = createSelector(
  selectCartTotal,
  selectDiscount,
  (total, discount) => Math.max(0, total - discount)
);

