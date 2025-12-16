import { createAction, props } from '@ngrx/store';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: Order }>()
);

export const loadOrdersFromStorage = createAction(
  '[Orders] Load Orders From Storage',
  props<{ orders: Order[] }>()
);

export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ orderId: string; status: Order['status'] }>()
);

export const loadOrders = createAction('[Orders] Load Orders');

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

