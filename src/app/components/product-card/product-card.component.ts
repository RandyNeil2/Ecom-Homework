import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectIsWishlisted } from '../../state/wishlist/wishlist.selectors';
import { toggleWishlist } from '../../state/wishlist/wishlist.actions';
import { Product } from '../../../mocks/data';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule
  ],
  styles: [`
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      border: none;
      border-radius: 12px;
      overflow: hidden;
      background: white;
    }
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    .image-container {
      position: relative;
      padding-top: 100%; /* 1:1 Aspect Ratio */
      background: #f8f9fa;
      overflow: hidden;
    }
    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    .card-content {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .category-chip {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      font-weight: 600;
    }
    .badges-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stock-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .out-of-stock {
      background: #ffebee;
      color: #c62828;
    }
    .low-stock {
      background: #fff3e0;
      color: #ef6c00;
    }
    .in-stock {
      font-size: 12px;
      font-weight: 600;
      color: #2e7d32;
    }
    .product-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.4;
      color: #1a1a1a;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 12px;
    }
    .price {
      font-weight: 700;
      font-size: 1.2rem;
      color: var(--mat-sys-primary);
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: #ffb300;
    }
    .actions-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .actions-overlay button {
      background-color: #e53935 !important;
      color: white !important;
    }
    .actions-overlay button mat-icon {
      color: white !important;
    }
    .actions-overlay button:disabled {
      background-color: #999 !important;
    }
    .product-card:hover .actions-overlay {
      opacity: 1;
    }
  `],
  template: `
    <mat-card class="product-card mat-elevation-z2" [routerLink]="['/shop/products', id]">
      <div class="image-container">
        <!-- Placeholder image logic if no image provided -->
        <img [src]="'https://picsum.photos/seed/' + id + '/400/400'" [alt]="name" class="product-image">
        
        <div class="actions-overlay" (click)="$event.stopPropagation()">
          <button mat-mini-fab color="warn" matTooltip="Add to Cart" 
                  (click)="onAddToCart($event)"
                  [disabled]="stock === 0"
                  [attr.aria-label]="stock === 0 ? 'Out of stock' : 'Add to cart'">
            <mat-icon>{{ stock === 0 ? 'remove_shopping_cart' : 'add_shopping_cart' }}</mat-icon>
          </button>
          <button mat-mini-fab color="warn" 
                  matTooltip="Add to Wishlist" 
                  (click)="toggleWishlist($event)"
                  [attr.aria-label]="(isWishlisted$ | async) ? 'Remove from wishlist' : 'Add to wishlist'">
            <mat-icon>{{ (isWishlisted$ | async) ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>
        </div>
      </div>

      <div class="card-content">
        <div class="badges-row">
          <div class="category-chip">{{ category || 'Premium Collection' }}</div>
          <div *ngIf="stock === 0" class="stock-badge out-of-stock">Out of Stock</div>
          <div *ngIf="stock > 0 && stock <= lowStockThreshold" class="stock-badge low-stock">
            Only {{ stock }} left
          </div>
        </div>
        <h3 class="product-title">{{ name }}</h3>
        
        <div class="rating" *ngIf="avgRating > 0">
          <mat-icon style="font-size: 16px; height: 16px; width: 16px;">star</mat-icon>
          <span>{{ avgRating | number:'1.1-1' }}</span>
        </div>

        <div class="price-row">
          <span class="price">{{ price | currency:'EUR' }}</span>
          <span *ngIf="stock > lowStockThreshold" class="in-stock">In Stock</span>
        </div>
      </div>
    </mat-card>
  `,
})
export class ProductCardComponent {
  @Input() id = 0;
  @Input() name = '';
  @Input() price = 0;
  @Input() created_at = '';
  @Input() avgRating = 0;
  @Input() description = '';
  @Input() category = '';
  @Input() rating = 0;
  @Input() image = '';
  @Input() stock = 0;
  @Input() lowStockThreshold = 10;

  @Output() addToCart = new EventEmitter<void>();

  private store = inject(Store);
  isWishlisted$ = this.store.select(selectIsWishlisted(0)); // Initial dummy

  ngOnChanges() {
    if (this.id) {
      this.isWishlisted$ = this.store.select(selectIsWishlisted(this.id));
    }
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    if (this.stock > 0) {
      this.addToCart.emit();
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    const product: Product = {
      id: this.id,
      name: this.name,
      price: this.price,
      created_at: this.created_at,
      owner_id: 0, // Mock
      ratings: [], // Mock
      stock: this.stock,
      lowStockThreshold: this.lowStockThreshold,
      description: this.description,
      category: this.category,
      rating: this.rating,
      image: this.image,
      features: []
    };
    this.store.dispatch(toggleWishlist({ product }));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
