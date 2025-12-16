import { Component, Input, ChangeDetectionStrategy, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReviewFormComponent } from './review-form.component';
import { loadReviews, addReview } from '../../../state/reviews/reviews.actions';
import { selectReviewsForProduct, selectReviewsLoading } from '../../../state/reviews/reviews.selectors';

@Component({
  selector: 'app-product-reviews-section',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReviewFormComponent
  ],
  template: `
    <div class="reviews-section">
      <h2>Customer Reviews</h2>

      <div *ngIf="loading$ | async" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="reviews-list" *ngIf="reviews$ | async as reviews">
        <div *ngIf="reviews.length === 0 && !(loading$ | async)" class="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>

        <mat-card *ngFor="let review of reviews" class="review-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar">{{ review.userName.charAt(0) }}</div>
            <mat-card-title>{{ review.userName }}</mat-card-title>
            <mat-card-subtitle>{{ review.date | date }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="rating" [attr.aria-label]="'Rated ' + review.rating + ' out of 5 stars'">
              <mat-icon *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= review.rating" aria-hidden="true">star</mat-icon>
            </div>
            <p>{{ review.comment }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <app-review-form (submitReview)="onAddReview($event)"></app-review-form>
    </div>
  `,
  styles: [`
    .reviews-section {
      margin-top: 3rem;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .review-card {
      margin-bottom: 1rem;
    }
    .avatar {
      background: #ccc;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .rating {
      color: #e0e0e0;
      margin-bottom: 0.5rem;
    }
    .rating .filled {
      color: #ffc107;
    }
    .no-reviews {
      text-align: center;
      color: #666;
      padding: 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewsSectionComponent implements OnChanges {
  @Input({ required: true }) productId!: number;

  private store = inject(Store);
  
  reviews$ = this.store.select(selectReviewsForProduct(0)); // Initial
  loading$ = this.store.select(selectReviewsLoading);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      this.reviews$ = this.store.select(selectReviewsForProduct(this.productId));
      this.store.dispatch(loadReviews({ productId: this.productId }));
    }
  }

  onAddReview(reviewData: { userName: string; rating: number; comment: string }) {
    this.store.dispatch(addReview({
      review: {
        ...reviewData,
        productId: this.productId
      }
    }));
  }
}
