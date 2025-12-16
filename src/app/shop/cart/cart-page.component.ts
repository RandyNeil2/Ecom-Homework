import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CartItemComponent } from './cart-item.component';
import { PromoCodeInputComponent } from '../promotions/promo-code-input.component';
import { PromoSummaryComponent } from '../promotions/promo-summary.component';
import * as CartActions from '../../state/cart/cart.actions';
import { selectCartItems, selectCartTotal, selectDiscount, selectPromoCode, selectTotalWithDiscount } from '../../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    CartItemComponent,
    PromoCodeInputComponent,
    PromoSummaryComponent
  ],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        <span class="item-count" *ngIf="(cartItems$ | async)?.length as count">
          {{ count }} {{ count === 1 ? 'item' : 'items' }}
        </span>
      </div>

      <div *ngIf="(cartItems$ | async)?.length === 0" class="empty-state">
        <div class="empty-icon-container">
          <mat-icon>shopping_cart_checkout</mat-icon>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button mat-flat-button color="primary" routerLink="/shop/products">
          Start Shopping
        </button>
      </div>

      <div *ngIf="(cartItems$ | async)?.length! > 0" class="cart-layout">
        <!-- Cart Items List -->
        <div class="cart-items-section">
          <div class="items-header hidden-mobile">
            <span class="col-product">Product</span>
            <span class="col-qty">Quantity</span>
            <span class="col-total">Total</span>
            <span class="col-action"></span>
          </div>
          
          <div class="items-list">
            <app-cart-item
              *ngFor="let item of cartItems$ | async"
              [item]="item"
              (quantityChange)="onQuantityChange(item.product.id, $event)"
              (remove)="onRemoveItem(item.product.id)"
            ></app-cart-item>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="cart-sidebar">
          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>Order Summary</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <app-promo-code-input (applyCode)="onApplyPromo($event)"></app-promo-code-input>
              
              <div class="summary-details">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>{{ cartTotal$ | async | currency:'USD' }}</span>
                </div>
                <div class="summary-row" *ngIf="(discount$ | async)! > 0">
                  <span class="discount-label">Discount ({{ promoCode$ | async }})</span>
                  <span class="discount-value">-{{ discount$ | async | currency:'USD' }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span class="free-shipping">Free</span>
                </div>
                
                <mat-divider></mat-divider>
                
                <div class="summary-row total-row">
                  <span>Total</span>
                  <span class="total-amount">{{ ((cartTotal$ | async)! - (discount$ | async)!) | currency:'USD' }}</span>
                </div>
              </div>

              <div class="actions">
                <button mat-flat-button color="primary" class="checkout-btn" routerLink="/shop/checkout">
                  Proceed to Checkout
                </button>
                <button mat-stroked-button color="warn" class="clear-btn" (click)="onClearCart()">
                  Clear Cart
                </button>
              </div>
            </mat-card-content>
            
            <mat-card-footer class="security-footer">
              <mat-icon>lock</mat-icon>
              <span>Secure Checkout</span>
            </mat-card-footer>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px;
      min-height: 80vh;
    }

    .cart-header {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 32px;
    }

    .cart-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .item-count {
      color: var(--mat-sys-secondary);
      font-size: 1.1rem;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      text-align: center;
      background: #f8f9fa;
      border-radius: 16px;
    }

    .empty-icon-container {
      width: 120px;
      height: 120px;
      background: #e3f2fd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .empty-icon-container mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-primary);
    }

    .empty-state h2 {
      font-size: 1.75rem;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 32px;
      font-size: 1.1rem;
    }

    /* Cart Layout */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 960px) {
      .cart-layout {
        grid-template-columns: 1fr 380px;
      }
    }

    /* Items List */
    .items-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      padding: 0 24px 16px;
      border-bottom: 1px solid #e0e0e0;
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }

    @media (max-width: 600px) {
      .hidden-mobile {
        display: none;
      }
    }

    /* Summary Sidebar */
    .cart-sidebar {
      position: sticky;
      top: 90px;
      height: fit-content;
    }

    .summary-card {
      border-radius: 16px;
      overflow: hidden;
    }

    .summary-details {
      margin: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      color: #444;
      font-size: 1rem;
    }

    .discount-value {
      color: #2e7d32;
    }

    .free-shipping {
      color: #2e7d32;
      font-weight: 500;
    }

    .total-row {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--mat-sys-on-surface);
      margin-top: 16px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkout-btn {
      height: 48px;
      font-size: 1.1rem;
    }

    .security-footer {
      background: #f5f5f5;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #666;
      font-size: 0.875rem;
    }

    .security-footer mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class CartPageComponent {
  private store = inject(Store);
  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);
  discount$ = this.store.select(selectDiscount);
  promoCode$ = this.store.select(selectPromoCode);

  onQuantityChange(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  onRemoveItem(productId: number) {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  onClearCart() {
    this.store.dispatch(CartActions.clearCart());
  }

  onApplyPromo(code: string) {
    this.store.dispatch(CartActions.applyPromoCode({ code }));
  }
}

