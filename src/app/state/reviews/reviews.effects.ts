import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, delay } from 'rxjs/operators';
import * as ReviewsActions from './reviews.actions';

@Injectable()
export class ReviewsEffects {
  private actions$ = inject(Actions);

  // Mock API call
  loadReviews$ = createEffect(() => this.actions$.pipe(
    ofType(ReviewsActions.loadReviews),
    mergeMap(({ productId }) => {
      // Simulate API delay
      return of([
        { id: 1, productId, userName: 'Alice', rating: 5, comment: 'Great product!', date: new Date().toISOString() },
        { id: 2, productId, userName: 'Bob', rating: 4, comment: 'Good value.', date: new Date().toISOString() }
      ]).pipe(
        delay(500),
        map(reviews => ReviewsActions.loadReviewsSuccess({ reviews, productId })),
        catchError(error => of(ReviewsActions.loadReviewsFailure({ error: error.message })))
      );
    })
  ));

  addReview$ = createEffect(() => this.actions$.pipe(
    ofType(ReviewsActions.addReview),
    mergeMap(({ review }) => {
      const newReview: ReviewsActions.Review = {
        ...review,
        id: Math.floor(Math.random() * 1000),
        date: new Date().toISOString()
      };
      return of(newReview).pipe(
        delay(500),
        map(createdReview => ReviewsActions.addReviewSuccess({ review: createdReview })),
        catchError(error => of(ReviewsActions.addReviewFailure({ error: error.message })))
      );
    })
  ));
}
