import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (state) => state.items
);

export const selectIsWishlisted = (productId: number) => createSelector(
  selectWishlistItems,
  (items) => items.some(item => item.id === productId)
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.loading
);
