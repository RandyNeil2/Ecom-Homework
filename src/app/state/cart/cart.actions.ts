import { createAction, props } from '@ngrx/store';
import { Product } from '../../../mocks/data';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>()
);

export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCartFromStorage = createAction(
  '[Cart] Load Cart From Storage',
  props<{ items: CartItem[] }>()
);

export const applyPromoCode = createAction(
  '[Cart] Apply Promo Code',
  props<{ code: string }>()
);

export const applyPromoCodeSuccess = createAction(
  '[Cart] Apply Promo Code Success',
  props<{ code: string; discount: number }>()
);

export const applyPromoCodeFailure = createAction(
  '[Cart] Apply Promo Code Failure',
  props<{ error: string }>()
);

export const removePromoCode = createAction('[Cart] Remove Promo Code');

