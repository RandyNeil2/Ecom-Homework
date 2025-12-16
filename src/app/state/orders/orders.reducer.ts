import { createReducer, on } from '@ngrx/store';
import * as OrdersActions from './orders.actions';

export interface OrdersState {
  orders: OrdersActions.Order[];
}

export const initialState: OrdersState = {
  orders: [],
};

export const ordersReducer = createReducer(
  initialState,

  on(OrdersActions.addOrder, (state, { order }) => {
    const newOrders = [order, ...state.orders];
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(newOrders));
    return {
      ...state,
      orders: newOrders,
    };
  }),

  on(OrdersActions.loadOrdersFromStorage, (state, { orders }) => ({
    ...state,
    orders,
  })),

  on(OrdersActions.updateOrderStatus, (state, { orderId, status }) => {
    const updatedOrders = state.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    // Save to localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    return {
      ...state,
      orders: updatedOrders,
    };
  })
);

