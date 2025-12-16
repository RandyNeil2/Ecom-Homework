import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, take } from 'rxjs/operators';
import * as WishlistActions from './wishlist.actions';
import { selectWishlistItems } from './wishlist.selectors';

@Injectable()
export class WishlistEffects {
  private actions$ = inject(Actions);

  // In a real app, we would call a service here.
  // For now, we'll simulate with localStorage or just simple state manipulation.
  // Since the reducer handles the state, effects might be used for persistence.

  loadWishlist$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.loadWishlist),
    map(() => {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        return WishlistActions.loadWishlistSuccess({ items: JSON.parse(saved) });
      }
      return WishlistActions.loadWishlistSuccess({ items: [] });
    })
  ));

  saveToStorage$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.addToWishlist, WishlistActions.removeFromWishlist, WishlistActions.toggleWishlist),
    tap(action => {
      // We need the state to save it. But here we only have the action.
      // Ideally we select the state. But for simplicity, we can just save the item if it's add/remove.
      // However, toggle is tricky without state.
      // Better approach: use withLatestFrom to get the state.
    }),
    // Actually, let's just use the reducer to update state, and then an effect that listens to state changes?
    // Or just re-select the wishlist from store.
    mergeMap(() => {
        // This is a bit hacky without injecting Store to select state.
        // Let's inject Store.
        return of({ type: 'NOOP' });
    })
  ), { dispatch: false });

  private store = inject(Store);

  persistWishlist$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.addToWishlist, WishlistActions.removeFromWishlist, WishlistActions.toggleWishlist),
    // Wait for reducer to update
    mergeMap(() => this.store.select(selectWishlistItems).pipe(take(1))),
    tap(items => {
      localStorage.setItem('wishlist', JSON.stringify(items));
    })
  ), { dispatch: false });
}
