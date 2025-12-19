import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (state) => state.items
);

// Memoized selector for wishlist products (Section 6.3)
export const selectWishlistProducts = createSelector(
  selectWishlistItems,
  (items) => items
);

// Memoized selector for wishlist count (Section 6.3)
export const selectWishlistCount = createSelector(
  selectWishlistItems,
  (items) => items.length
);

export const selectIsWishlisted = (productId: number) => createSelector(
  selectWishlistItems,
  (items) => items.some(item => item.id === productId)
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.loading
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);

export const selectWishlistProductIds = createSelector(
  selectWishlistItems,
  (items) => items.map(item => item.id)
);
