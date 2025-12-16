import { createAction, props } from '@ngrx/store';
import { Product } from '../../../mocks/data';

export const loadWishlist = createAction('[Wishlist] Load Wishlist');

export const loadWishlistFromStorage = createAction(
  '[Wishlist] Load Wishlist From Storage',
  props<{ items: Product[] }>()
);

export const loadWishlistSuccess = createAction(
  '[Wishlist] Load Wishlist Success',
  props<{ items: Product[] }>()
);

export const loadWishlistFailure = createAction(
  '[Wishlist] Load Wishlist Failure',
  props<{ error: string }>()
);

export const addToWishlist = createAction(
  '[Wishlist] Add To Wishlist',
  props<{ product: Product }>()
);

export const removeFromWishlist = createAction(
  '[Wishlist] Remove From Wishlist',
  props<{ productId: number }>()
);

export const toggleWishlist = createAction(
  '[Wishlist] Toggle Wishlist',
  props<{ product: Product }>()
);
