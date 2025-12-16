import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.reducer';

export const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');

export const selectReviewsForProduct = (productId: number) => createSelector(
  selectReviewsState,
  (state) => state.reviews[productId] || []
);

export const selectReviewsLoading = createSelector(
  selectReviewsState,
  (state) => state.loading
);
