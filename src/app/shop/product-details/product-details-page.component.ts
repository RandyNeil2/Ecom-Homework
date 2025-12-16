import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShopApiService } from '../../services/shop-api.service';
import * as CartActions from '../../state/cart/cart.actions';
import { Product } from '../../../mocks/data';
import { avgRating } from '../../../mocks/utils';
import { ProductReviewsSectionComponent } from './reviews/product-reviews-section.component';
import { WishlistButtonComponent } from '../wishlist/wishlist-button.component';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    ProductReviewsSectionComponent,
    WishlistButtonComponent
  ],
  template: `
    <div class="product-details-container">
      <!-- Breadcrumb / Back -->
      <div class="breadcrumb">
        <a routerLink="/shop/products" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          Back to Collection
        </a>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-state">
        <mat-icon color="warn" style="font-size: 48px; height: 48px; width: 48px;">error_outline</mat-icon>
        <h3>Product not found</h3>
        <p>{{ error }}</p>
        <button mat-stroked-button color="primary" routerLink="/shop/products">Browse Products</button>
      </div>

      <div *ngIf="product && !loading" class="product-content">
        <div class="product-grid">
          <!-- Left: Image Gallery -->
          <div class="product-gallery">
            <div class="main-image-container mat-elevation-z2">
              <img [src]="'https://picsum.photos/seed/' + product.id + '/800/800'" [alt]="product.name" class="main-image">
              <div class="wishlist-overlay">
                <app-wishlist-button [product]="product"></app-wishlist-button>
              </div>
            </div>
            <div class="thumbnails">
              <div class="thumb active">
                <img [src]="'https://picsum.photos/seed/' + product.id + '/100/100'" alt="Thumbnail 1">
              </div>
              <div class="thumb">
                <img [src]="'https://picsum.photos/seed/' + (product.id + 1) + '/100/100'" alt="Thumbnail 2">
              </div>
              <div class="thumb">
                <img [src]="'https://picsum.photos/seed/' + (product.id + 2) + '/100/100'" alt="Thumbnail 3">
              </div>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="product-info">
            <div class="product-header">
              <div class="category-badge">Premium Collection</div>
              <h1 class="product-title">{{ product.name }}</h1>
              
              <div class="rating-row">
                <div class="stars">
                  <mat-icon class="star-filled">star</mat-icon>
                  <mat-icon class="star-filled">star</mat-icon>
                  <mat-icon class="star-filled">star</mat-icon>
                  <mat-icon class="star-filled">star</mat-icon>
                  <mat-icon class="star-half">star_half</mat-icon>
                </div>
                <span class="rating-text">{{ getAvgRating() | number: '1.1-1' }} (128 reviews)</span>
              </div>

              <div class="price-row">
                <span class="price">{{ product.price | currency:'USD' }}</span>
                <span class="stock-status" [class.in-stock]="product.stock > 0" [class.out-of-stock]="product.stock === 0">
                  {{ product.stock > 0 ? 'In Stock (' + product.stock + ' available)' : 'Out of Stock' }}
                </span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="product-description-short">
              <p>Experience luxury with this premium {{ product.name }}. Crafted with attention to detail and designed for those who appreciate quality.</p>
            </div>

            <div class="actions-section">
              <div class="quantity-selector">
                <button mat-icon-button (click)="decrementQty()" [disabled]="quantity <= 1">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="qty-display">{{ quantity }}</span>
                <button mat-icon-button (click)="incrementQty()" [disabled]="quantity >= product.stock">
                  <mat-icon>add</mat-icon>
                </button>
              </div>

              <button 
                mat-raised-button 
                color="primary" 
                class="add-to-cart-btn"
                (click)="onAddToCart()" 
                [disabled]="product.stock === 0">
                <mat-icon>shopping_bag</mat-icon>
                Add to Cart
              </button>
            </div>

            <div class="features-list">
              <div class="feature-item">
                <mat-icon>local_shipping</mat-icon>
                <span>Free Shipping</span>
              </div>
              <div class="feature-item">
                <mat-icon>verified</mat-icon>
                <span>2 Year Warranty</span>
              </div>
              <div class="feature-item">
                <mat-icon>cached</mat-icon>
                <span>30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="product-tabs-section">
          <mat-tab-group animationDuration="0ms" mat-stretch-tabs="false" mat-align-tabs="start">
            <mat-tab label="Description">
              <div class="tab-content">
                <h3>Product Details</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            </mat-tab>
            <mat-tab label="Specifications">
              <div class="tab-content">
                <table class="specs-table">
                  <tr>
                    <td>Material</td>
                    <td>Premium Composite</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>1.2 kg</td>
                  </tr>
                  <tr>
                    <td>Dimensions</td>
                    <td>24 x 12 x 5 cm</td>
                  </tr>
                  <tr>
                    <td>Origin</td>
                    <td>France</td>
                  </tr>
                </table>
              </div>
            </mat-tab>
            <mat-tab label="Reviews">
              <div class="tab-content">
                <app-product-reviews-section [productId]="product.id"></app-product-reviews-section>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-details-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .breadcrumb {
      margin-bottom: 32px;
    }
    
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .back-link:hover {
      color: var(--mat-sys-primary);
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
    }

    .product-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
    }

    @media (min-width: 960px) {
      .product-grid {
        grid-template-columns: 1.2fr 1fr;
      }
    }

    .main-image-container {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      background: #f8f9fa;
      aspect-ratio: 1;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .wishlist-overlay {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .thumbnails {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    .thumb {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      opacity: 0.7;
      transition: all 0.2s;
    }

    .thumb.active, .thumb:hover {
      border-color: var(--mat-sys-primary);
      opacity: 1;
    }

    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-header {
      margin-bottom: 24px;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #f0f0f0;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 16px;
    }

    .product-title {
      font-size: 2.5rem;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .stars {
      color: #ffb300;
      display: flex;
    }

    .rating-text {
      color: #666;
      font-size: 0.9rem;
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--mat-sys-primary);
    }

    .stock-status {
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .in-stock { background: #e8f5e9; color: #2e7d32; }
    .out-of-stock { background: #ffebee; color: #c62828; }

    .product-description-short {
      margin: 24px 0;
      color: #444;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .actions-section {
      display: flex;
      gap: 16px;
      margin: 32px 0;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .qty-display {
      width: 40px;
      text-align: center;
      font-weight: 600;
    }

    .add-to-cart-btn {
      flex: 1;
      height: 48px;
      font-size: 1.1rem;
    }

    .features-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #eee;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #666;
    }

    .product-tabs-section {
      margin-top: 64px;
    }

    .tab-content {
      padding: 32px 0;
      max-width: 800px;
    }

    .specs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .specs-table td {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .specs-table td:first-child {
      font-weight: 600;
      width: 200px;
      color: #444;
    }
  `]
})
export class ProductDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private apiService = inject(ShopApiService);
  private snackBar = inject(MatSnackBar);

  product: Product | null = null;
  loading = false;
  error: string | null = null;
  quantity = 1;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.error = null;
    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load product';
        this.loading = false;
      },
    });
  }

  getAvgRating(): number {
    if (!this.product) return 0;
    return avgRating(this.product.ratings);
  }

  incrementQty() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onAddToCart() {
    if (this.product) {
      this.store.dispatch(CartActions.addItem({ product: this.product, quantity: this.quantity }));
      this.snackBar.open('Product added to cart!', 'View Cart', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
}

