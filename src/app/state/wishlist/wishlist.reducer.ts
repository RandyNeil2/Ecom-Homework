import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../mocks/data';
import * as WishlistActions from './wishlist.actions';

export interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null
};

// Helper to save to storage
const saveToStorage = (items: Product[]) => {
  localStorage.setItem('wishlist', JSON.stringify(items));
};

export const wishlistReducer = createReducer(
  initialState,
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WishlistActions.loadWishlistFromStorage, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),
  on(WishlistActions.loadWishlistSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false
  })),
  on(WishlistActions.loadWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(WishlistActions.addToWishlist, (state, { product }) => {
    if (state.items.some(p => p.id === product.id)) return state;
    const newItems = [...state.items, product];
    saveToStorage(newItems);
    return {
      ...state,
      items: newItems
    };
  }),
  on(WishlistActions.removeFromWishlist, (state, { productId }) => {
    const newItems = state.items.filter(p => p.id !== productId);
    saveToStorage(newItems);
    return {
      ...state,
      items: newItems
    };
  }),
  on(WishlistActions.toggleWishlist, (state, { product }) => {
    const exists = state.items.some(p => p.id === product.id);
    let newItems;
    if (exists) {
      newItems = state.items.filter(p => p.id !== product.id);
    } else {
      newItems = [...state.items, product];
    }
    saveToStorage(newItems);
    return {
      ...state,
      items: newItems
    };
  })
);
