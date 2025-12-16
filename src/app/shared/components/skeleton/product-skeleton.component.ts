import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="product-skeleton">
      <div class="skeleton-image pulse"></div>
      <mat-card-content>
        <div class="skeleton-text title pulse"></div>
        <div class="skeleton-text price pulse"></div>
        <div class="skeleton-text meta pulse"></div>
      </mat-card-content>
      <mat-card-actions>
        <div class="skeleton-button pulse"></div>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .product-skeleton {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .pulse {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .skeleton-image {
      height: 200px;
      width: 100%;
      background-color: #eee;
    }

    .skeleton-text {
      height: 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      background-color: #eee;
    }

    .title { width: 80%; height: 24px; margin-bottom: 16px; }
    .price { width: 40%; }
    .meta { width: 60%; }

    .skeleton-button {
      height: 36px;
      width: 100%;
      border-radius: 4px;
      background-color: #eee;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSkeletonComponent {}
