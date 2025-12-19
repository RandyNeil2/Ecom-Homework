import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState } from './orders.reducer';
import { Order } from './orders.actions';

export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

export const selectAllOrders = createSelector(
  selectOrdersState,
  (state) => state.orders
);

export const selectOrdersCount = createSelector(
  selectAllOrders,
  (orders) => orders.length
);

// Memoized selector for orders by status (Section 6.3)
export const selectOrdersByStatus = (status: Order['status']) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.status === status)
  );

export const selectOrderById = (orderId: string) =>
  createSelector(selectAllOrders, (orders) =>
    orders.find((order) => order.id === orderId || order.orderNumber === orderId)
  );

export const selectProcessingOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(order => order.status === 'Processing')
);

export const selectShippedOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(order => order.status === 'Shipped')
);

export const selectDeliveredOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(order => order.status === 'Delivered')
);

export const selectTotalOrdersRevenue = createSelector(
  selectAllOrders,
  (orders) => orders.reduce((sum, order) => sum + order.total, 0)
);

export const selectRecentOrders = (count: number = 5) => createSelector(
  selectAllOrders,
  (orders) => [...orders].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, count)
);
