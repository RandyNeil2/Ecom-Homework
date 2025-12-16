import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutLayoutComponent } from './checkout-layout.component';
import { CheckoutStepperComponent } from './checkout-stepper.component';
import { ShopApiService } from '../../services/shop-api.service';
import { selectCartItems } from '../../state/cart/cart.selectors';
import * as CartActions from '../../state/cart/cart.actions';
import * as OrdersActions from '../../state/orders/orders.actions';

export interface OrderResponse {
  order_number: string;
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-step3-confirm',
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CheckoutLayoutComponent,
    CheckoutStepperComponent
  ],
  template: `
    <app-checkout-layout>
      <div breadcrumbs>
        <app-checkout-stepper [currentStep]="3"></app-checkout-stepper>
      </div>

      <div class="step-content">
        <!-- Loading State -->
        <div *ngIf="loading" class="state-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Processing your order...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="state-container error">
          <div class="icon-circle error">
            <mat-icon>error_outline</mat-icon>
          </div>
          <h3>Order Failed</h3>
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="retryOrder()">Try Again</button>
        </div>

        <!-- Success State -->
        <div *ngIf="orderNumber && !loading" class="state-container success">
          <div class="icon-circle success">
            <mat-icon>check</mat-icon>
          </div>
          <h2>Order Confirmed!</h2>
          <p class="order-number">Order #{{ orderNumber }}</p>
          <p class="thank-you">Thank you for your purchase.</p>
          
          <div class="actions">
            <a routerLink="/shop/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        </div>

        <!-- Review State (Before Placement) -->
        <div *ngIf="!orderNumber && !loading && !error" class="review-section">
          <div class="section-header">
            <h2>Review & Pay</h2>
          </div>

          <div class="review-card">
            <div class="review-row">
              <span class="label">Contact</span>
              <span class="value">{{ address?.email || 'guest@example.com' }}</span>
              <a routerLink="/shop/checkout/address" class="change-link">Change</a>
            </div>
            <div class="divider"></div>
            <div class="review-row">
              <span class="label">Ship to</span>
              <span class="value">
                {{ address?.street }}, {{ address?.city }} {{ address?.postalCode }}, {{ address?.country }}
              </span>
              <a routerLink="/shop/checkout/address" class="change-link">Change</a>
            </div>
          </div>

          <div class="payment-section">
            <h3>Payment</h3>
            <p class="payment-note">All transactions are secure and encrypted.</p>
            
            <div class="payment-placeholder">
              <p>Payment integration would go here (Stripe/PayPal)</p>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/shop/checkout/address" class="return-link">
              <span class="arrow">&lt;</span> Return to shipping
            </a>
            <button class="btn btn-primary" (click)="placeOrder()">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </app-checkout-layout>
  `,
  styles: [`
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 3rem 0;
      gap: 1rem;
    }

    .icon-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .icon-circle.success {
      background: #dcfce7;
      color: #16a34a;
    }

    .icon-circle.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .icon-circle mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .order-number {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .thank-you {
      color: #6b7280;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.125rem;
      font-weight: 500;
      color: #1f2937;
    }

    h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .review-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      padding: 1rem;
      margin-bottom: 2rem;
    }

    .review-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .review-row {
        flex-direction: row;
        align-items: baseline;
      }
    }

    .label {
      color: #6b7280;
      width: 80px;
      font-size: 0.875rem;
    }

    .value {
      flex: 1;
      color: #1f2937;
      font-size: 0.875rem;
    }

    .change-link {
      color: var(--color-accent, #2563eb);
      font-size: 0.75rem;
      cursor: pointer;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1rem 0;
    }

    .payment-section {
      margin-bottom: 2rem;
    }

    .payment-note {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .payment-placeholder {
      background: #f9fafb;
      border: 1px dashed #d1d5db;
      border-radius: 0.375rem;
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    @media (min-width: 640px) {
      .form-actions {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .return-link {
      color: var(--color-accent, #2563eb);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      padding: 1.25rem 2rem;
      font-size: 1rem;
      width: 100%;
    }

    @media (min-width: 640px) {
      .btn-primary {
        width: auto;
      }
    }
  `]
})
export class Step3ConfirmComponent implements OnInit {
  private store = inject(Store);
  private apiService = inject(ShopApiService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  orderNumber: string | null = null;
  address: any = null;

  ngOnInit() {
    const addressData = sessionStorage.getItem('checkoutAddress');
    if (!addressData) {
      this.router.navigate(['/shop/checkout/address']);
      return;
    }
    this.address = JSON.parse(addressData);
  }

  placeOrder() {
    this.loading = true;
    this.error = null;

    this.store
      .select(selectCartItems)
      .pipe(take(1))
      .subscribe((items) => {
        const orderData = {
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          address: this.address,
        };

        this.apiService.createOrder(orderData).subscribe({
          next: (response) => {
            this.orderNumber = response.order_number;
            this.loading = false;
            
            const order: OrdersActions.Order = {
              id: `order-${Date.now()}`,
              orderNumber: response.order_number,
              date: new Date().toISOString().split('T')[0],
              total: response.total,
              status: 'Processing',
              items: items.map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              })),
              shippingAddress: {
                street: this.address.street || '',
                city: this.address.city || '',
                zipCode: this.address.postalCode || '',
                country: this.address.country || ''
              },
            };
            this.store.dispatch(OrdersActions.addOrder({ order }));
            
            this.store.dispatch(CartActions.clearCart());
            sessionStorage.removeItem('checkoutAddress');
          },
          error: (err) => {
            this.error = err.error?.detail || 'Failed to place order';
            this.loading = false;
          },
        });
      });
  }

  retryOrder() {
    this.error = null;
    this.placeOrder();
  }
}

