import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import * as CartActions from './cart/cart.actions';
import * as WishlistActions from './wishlist/wishlist.actions';
import * as ReviewsActions from './reviews/reviews.actions';

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);

  showSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.addItem,
      CartActions.applyPromoCodeSuccess,
      WishlistActions.toggleWishlist,
      ReviewsActions.addReviewSuccess
    ),
    tap((action) => {
      let message = 'Operation successful';
      
      if (action.type === CartActions.addItem.type) {
        message = 'Product added to cart';
      } else if (action.type === CartActions.applyPromoCodeSuccess.type) {
        message = 'Promo code applied!';
      } else if (action.type === WishlistActions.toggleWishlist.type) {
        message = 'Wishlist updated';
      } else if (action.type === ReviewsActions.addReviewSuccess.type) {
        message = 'Review submitted successfully';
      }

      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    })
  ), { dispatch: false });

  showError$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.applyPromoCodeFailure,
      ReviewsActions.addReviewFailure
    ),
    tap((action) => {
      let message = 'An error occurred';
      if ('error' in action) {
        message = action.error;
      }
      
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    })
  ), { dispatch: false });
}
