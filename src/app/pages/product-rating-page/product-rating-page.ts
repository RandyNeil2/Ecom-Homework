import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ShopApiService, ProductRatingResponse } from '../../services/shop-api.service';

@Component({
  standalone: true,
  selector: 'app-product-rating-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './product-rating-page.html',
  styleUrls: ['./product-rating-page.css'],
})
export class ProductRatingPageComponent {
  private fb = inject(FormBuilder);
  private api = inject(ShopApiService);

  form = this.fb.group({
    productId: ['', [Validators.required, Validators.min(1)]],
  });

  loading = false;
  error: string | null = null;
  ratingData: ProductRatingResponse | null = null;

  onSubmit() {
    if (this.form.invalid) return;

    const productId = Number(this.form.get('productId')?.value);
    if (isNaN(productId) || productId < 1) {
      this.error = 'Please enter a valid product ID';
      return;
    }

    this.loading = true;
    this.error = null;
    this.ratingData = null;

    this.api.getRating(productId).subscribe({
      next: (data) => {
        this.ratingData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to fetch rating';
        this.loading = false;
      },
    });
  }
}
