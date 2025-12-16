import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="review-form">
      <h3>Write a Review</h3>
      
      <div class="rating-field">
        <label>Rating</label>
        <mat-form-field appearance="outline">
          <mat-select formControlName="rating">
            <mat-option [value]="5">⭐⭐⭐⭐⭐ (5)</mat-option>
            <mat-option [value]="4">⭐⭐⭐⭐ (4)</mat-option>
            <mat-option [value]="3">⭐⭐⭐ (3)</mat-option>
            <mat-option [value]="2">⭐⭐ (2)</mat-option>
            <mat-option [value]="1">⭐ (1)</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Your Name</mat-label>
        <input matInput formControlName="userName" placeholder="John Doe">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Comment</mat-label>
        <textarea matInput formControlName="comment" rows="4" placeholder="Share your thoughts..."></textarea>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid">
        Submit Review
      </button>
    </form>
  `,
  styles: [`
    .review-form {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .full-width {
      width: 100%;
    }
    .rating-field {
      margin-bottom: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewFormComponent {
  @Output() submitReview = new EventEmitter<{ userName: string; rating: number; comment: string }>();

  private fb = inject(FormBuilder);

  reviewForm = this.fb.group({
    userName: ['', Validators.required],
    rating: [5, Validators.required],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.reviewForm.valid) {
      this.submitReview.emit(this.reviewForm.value as any);
      this.reviewForm.reset({ rating: 5 });
    }
  }
}
