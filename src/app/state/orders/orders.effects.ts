import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as OrdersActions from './orders.actions';

@Injectable()
export class OrdersEffects {
  private actions$ = inject(Actions);

  loadOrdersFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders),
      tap(() => {
        const ordersJson = localStorage.getItem('orders');
        if (ordersJson) {
          try {
            const orders = JSON.parse(ordersJson);
            return OrdersActions.loadOrdersSuccess({ orders });
          } catch {
            return OrdersActions.loadOrdersFailure({ error: 'Failed to parse orders' });
          }
        }
        return OrdersActions.loadOrdersSuccess({ orders: [] });
      })
    ),
    { dispatch: false }
  );
}
