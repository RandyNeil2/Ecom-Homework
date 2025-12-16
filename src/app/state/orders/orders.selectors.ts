import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState } from './orders.reducer';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = createSelector(
  selectOrdersState,
  (state) => state.orders
);

export const selectOrdersByStatus = (status: string) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.status === status)
  );

export const selectOrderById = (orderId: string) =>
  createSelector(selectAllOrders, (orders) =>
    orders.find((order) => order.id === orderId)
  );

