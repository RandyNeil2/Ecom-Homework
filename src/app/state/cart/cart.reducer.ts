import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';

export interface CartState {
  items: CartActions.CartItem[];
  promoCode: string | null;
  discount: number;
  error: string | null;
}

export const initialState: CartState = {
  items: [],
  promoCode: null,
  discount: 0,
  error: null
};

export const cartReducer = createReducer(
  initialState,

  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }
    return {
      ...state,
      items: [...state.items, { product, quantity }],
    };
  }),

  on(CartActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.product.id !== productId),
  })),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== productId),
      };
    }
    return {
      ...state,
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    };
  }),

  on(CartActions.clearCart, (state) => ({
    ...state,
    items: [],
    promoCode: null,
    discount: 0
  })),

  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items,
  })),

  on(CartActions.applyPromoCodeSuccess, (state, { code, discount }) => ({
    ...state,
    promoCode: code,
    discount,
    error: null
  })),

  on(CartActions.applyPromoCodeFailure, (state, { error }) => ({
    ...state,
    error,
    promoCode: null,
    discount: 0
  })),

  on(CartActions.removePromoCode, (state) => ({
    ...state,
    promoCode: null,
    discount: 0,
    error: null
  }))
);

