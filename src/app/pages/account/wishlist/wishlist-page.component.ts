import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectWishlistItems } from '../../../state/wishlist/wishlist.selectors';
import { loadWishlistFromStorage, removeFromWishlist } from '../../../state/wishlist/wishlist.actions';
import { addItem } from '../../../state/cart/cart.actions';
import { Product } from '../../../../mocks/data';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="wishlist-container">
      <div class="header">
        <h1>My Wishlist</h1>
        <p>{{ (wishlistItems$ | async)?.length || 0 }} items</p>
      </div>

      <div class="wishlist-grid" *ngIf="wishlistItems$ | async as items">
        <div *ngIf="items.length === 0" class="empty-state">
          <mat-icon>favorite_border</mat-icon>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to buy later.</p>
          <button mat-raised-button color="primary" routerLink="/shop/products">Start Shopping</button>
        </div>

        <mat-card *ngFor="let item of items" class="wishlist-item premium-card">
          <div class="item-image">
            <!-- Placeholder for image -->
            <span class="emoji-img">{{ item.name.charAt(0) }}</span>
          </div>
          <mat-card-content>
            <h3 class="item-title">{{ item.name }}</h3>
            <p class="item-price">{{ item.price | currency:'EUR' }}</p>
            <p class="stock-status" [class.in-stock]="item.stock > 0">
              {{ item.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="addToCart(item)" [disabled]="item.stock === 0">
              Add to Cart
            </button>
            <button mat-icon-button color="warn" (click)="removeFromWishlist(item.id)" matTooltip="Remove">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 24px;
    }

    .header {
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1a237e;
      margin: 0;
    }

    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .wishlist-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .wishlist-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .item-image {
      height: 200px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      color: #ccc;
    }

    mat-card-content {
      flex: 1;
      padding: 16px;
    }

    .item-title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .item-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a237e;
      margin-bottom: 8px;
    }

    .stock-status {
      font-size: 0.875rem;
      color: #f44336;
    }

    .stock-status.in-stock {
      color: #4caf50;
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #eee;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 0;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `]
})
export class WishlistPageComponent implements OnInit {
  private store = inject(Store);
  wishlistItems$ = this.store.select(selectWishlistItems);

  ngOnInit() {
    // Load from storage if not already loaded (handled by reducer/effects usually, but we can trigger it)
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        this.store.dispatch(loadWishlistFromStorage({ items }));
      } catch (e) {
        console.error('Failed to load wishlist', e);
      }
    }
  }

  addToCart(product: Product) {
    this.store.dispatch(addItem({ product, quantity: 1 }));
  }

  removeFromWishlist(productId: number) {
    this.store.dispatch(removeFromWishlist({ productId }));
  }
}
