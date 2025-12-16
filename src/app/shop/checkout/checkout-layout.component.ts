import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-checkout-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="checkout-layout">
      <!-- Left Column: Main Content -->
      <div class="main-content">
        <header class="checkout-header">
          <a routerLink="/" class="logo">My Shop</a>
          <nav class="breadcrumbs">
            <ng-content select="[breadcrumbs]"></ng-content>
          </nav>
        </header>
        
        <main>
          <ng-content></ng-content>
        </main>
        
        <footer class="checkout-footer">
          <p>&copy; 2025 My Shop. All rights reserved.</p>
        </footer>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="order-summary">
        <div class="summary-content">
          <div class="cart-items">
            <div class="item" *ngFor="let item of cartItems$ | async">
              <div class="item-image">
                <div class="badge">{{ item.quantity }}</div>
                <!-- Placeholder for image if not available -->
                <div class="img-placeholder">{{ item.product.name.charAt(0) }}</div>
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.product.name }}</div>
                <div class="item-variant" *ngIf="item.product.stock < 5">Low Stock</div>
              </div>
              <div class="item-price">{{ item.product.price * item.quantity | currency:'EUR' }}</div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="totals">
            <div class="row">
              <span>Subtotal</span>
              <span>{{ cartTotal$ | async | currency:'EUR' }}</span>
            </div>
            <div class="row">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="total-row">
            <span>Total</span>
            <div class="total-amount">
              <span class="currency">EUR</span>
              <span class="amount">{{ cartTotal$ | async | currency:'EUR' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-layout {
      display: flex;
      flex-direction: column-reverse;
      min-height: 100vh;
    }

    @media (min-width: 1000px) {
      .checkout-layout {
        flex-direction: row;
      }
    }

    /* Main Content Area */
    .main-content {
      flex: 1;
      padding: 2rem 1rem;
      background: white;
      max-width: 100%;
    }

    @media (min-width: 1000px) {
      .main-content {
        padding: 8rem 4rem 2rem; /* Increased top padding for 90px header */
        max-width: 58%;
        border-right: 1px solid #e5e7eb;
      }
    }

    .checkout-header {
      margin-bottom: 2rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      color: black;
      text-decoration: none;
      display: block;
      margin-bottom: 1rem;
    }

    .checkout-footer {
      margin-top: 4rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Order Summary Area */
    .order-summary {
      flex: 1;
      background: #f5f5f5;
      padding: 2rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    @media (min-width: 1000px) {
      .order-summary {
        max-width: 42%;
        padding: 8rem 3rem 4rem; /* Increased top padding to match main content */
        border-bottom: none;
        border-left: 1px solid #e5e7eb;
        min-height: 100vh;
      }
    }

    .summary-content {
      max-width: 400px;
      margin: 0 auto;
    }

    @media (min-width: 1000px) {
      .summary-content {
        margin: 0;
        position: sticky;
        top: 110px; /* 90px header + 20px gap */
      }
    }

    /* Cart Items */
    .item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .item-image {
      position: relative;
      width: 64px;
      height: 64px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-placeholder {
      font-size: 1.5rem;
      color: #9ca3af;
      font-weight: 600;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #666;
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-weight: 500;
      font-size: 0.875rem;
      color: #374151;
    }

    .item-variant {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .item-price {
      font-weight: 500;
      font-size: 0.875rem;
      color: #374151;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1.5rem 0;
    }

    /* Totals */
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .total-amount {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .currency {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }
  `]
})
export class CheckoutLayoutComponent {
  cartItems$;
  cartTotal$;

  constructor(private store: Store) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartTotal$ = this.store.select(selectCartTotal);
  }
}
