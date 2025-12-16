import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartItem } from '../../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-cart-item',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <mat-card class="cart-item-card" appearance="outlined">
      <div class="item-content">
        <!-- Image -->
        <div class="item-image-container">
          <img [src]="'https://picsum.photos/seed/' + item.product.id + '/200/200'" [alt]="item.product.name" class="item-image">
        </div>

        <!-- Details -->
        <div class="item-details">
          <div class="item-header">
            <h3 class="item-name">{{ item.product.name }}</h3>
            <span class="item-price-mobile">{{ item.product.price | currency:'USD' }}</span>
          </div>
          <p class="item-meta">Product ID: {{ item.product.id }}</p>
          <p class="stock-status in-stock">In Stock</p>
        </div>

        <!-- Quantity -->
        <div class="item-quantity">
          <div class="qty-controls">
            <button mat-icon-button (click)="decreaseQuantity()" [disabled]="item.quantity <= 1">
              <mat-icon>remove</mat-icon>
            </button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button mat-icon-button (click)="increaseQuantity()">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </div>

        <!-- Total -->
        <div class="item-total hidden-mobile">
          <span class="total-price">{{ item.product.price * item.quantity | currency:'USD' }}</span>
          <span class="unit-price">{{ item.product.price | currency:'USD' }} each</span>
        </div>

        <!-- Actions -->
        <div class="item-actions">
          <button mat-icon-button color="warn" (click)="onRemove()" matTooltip="Remove Item">
            <mat-icon>delete_outline</mat-icon>
          </button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .cart-item-card {
      border-radius: 12px;
      overflow: hidden;
      background: white;
    }

    .item-content {
      display: grid;
      grid-template-columns: 100px 2fr 1fr 1fr auto;
      gap: 24px;
      padding: 16px;
      align-items: center;
    }

    .item-image-container {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }

    .item-meta {
      font-size: 0.85rem;
      color: #666;
      margin: 0 0 4px 0;
    }

    .stock-status {
      font-size: 0.85rem;
      font-weight: 500;
      margin: 0;
    }

    .in-stock { color: #2e7d32; }

    .qty-controls {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 24px;
      width: fit-content;
    }

    .qty-value {
      min-width: 32px;
      text-align: center;
      font-weight: 600;
    }

    .item-total {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .total-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: #333;
    }

    .unit-price {
      font-size: 0.85rem;
      color: #666;
    }

    .item-price-mobile {
      display: none;
    }

    @media (max-width: 768px) {
      .item-content {
        grid-template-columns: 80px 1fr;
        grid-template-areas: 
          "image details"
          "image quantity"
          "actions total";
        gap: 12px;
      }

      .item-image-container {
        grid-area: image;
        width: 80px;
        height: 80px;
      }

      .item-details {
        grid-area: details;
      }

      .item-quantity {
        grid-area: quantity;
      }

      .item-total {
        grid-area: total;
        align-items: flex-end;
      }

      .item-actions {
        grid-area: actions;
      }

      .hidden-mobile {
        display: block; /* Show total on mobile in different spot */
      }
      
      .item-total.hidden-mobile {
        display: none; /* Hide the desktop total column */
      }

      .item-price-mobile {
        display: block;
        font-weight: 700;
        color: var(--mat-sys-primary);
      }
    }
  `]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  onQuantityChange(quantity: number) {
    if (quantity > 0) {
      this.quantityChange.emit(quantity);
    }
  }

  increaseQuantity() {
    this.quantityChange.emit(this.item.quantity + 1);
  }

  decreaseQuantity() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  onRemove() {
    this.remove.emit();
  }
}

