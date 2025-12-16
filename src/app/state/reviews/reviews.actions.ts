import { createAction, props } from '@ngrx/store';

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const loadReviews = createAction(
  '[Reviews] Load Reviews',
  props<{ productId: number }>()
);

export const loadReviewsSuccess = createAction(
  '[Reviews] Load Reviews Success',
  props<{ reviews: Review[]; productId: number }>()
);

export const loadReviewsFailure = createAction(
  '[Reviews] Load Reviews Failure',
  props<{ error: string }>()
);

export const addReview = createAction(
  '[Reviews] Add Review',
  props<{ review: Omit<Review, 'id' | 'date'> }>()
);

export const addReviewSuccess = createAction(
  '[Reviews] Add Review Success',
  props<{ review: Review }>()
);

export const addReviewFailure = createAction(
  '[Reviews] Add Review Failure',
  props<{ error: string }>()
);
