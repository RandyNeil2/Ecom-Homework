import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, delay } from 'rxjs/operators';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  applyPromoCode$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.applyPromoCode),
    mergeMap(({ code }) => {
      // Mock validation
      const validCodes: { [key: string]: number } = {
        'SUMMER2025': 20,
        'WELCOME10': 10,
        'ANGULAR': 50
      };

      return of(code).pipe(
        delay(500),
        map(c => {
          const discount = validCodes[c.toUpperCase()];
          if (discount) {
            return CartActions.applyPromoCodeSuccess({ code: c.toUpperCase(), discount });
          } else {
            throw new Error('Invalid promo code');
          }
        }),
        catchError(error => of(CartActions.applyPromoCodeFailure({ error: error.message })))
      );
    })
  ));
}
