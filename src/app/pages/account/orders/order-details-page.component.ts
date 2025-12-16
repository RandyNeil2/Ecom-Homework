import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { selectAllOrders } from '../../../state/orders/orders.selectors';
import { map, switchMap } from 'rxjs/operators';
import { Order } from '../../../state/orders/orders.actions';

@Component({
  selector: 'app-order-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatDividerModule
  ],
  template: `
    <div class="order-details-container" *ngIf="order$ | async as order; else loading">
      <div class="header">
        <a routerLink="/account/orders" class="back-link">
          <mat-icon>arrow_back</mat-icon> Back to Orders
        </a>
        <h1>Order #{{ order.orderNumber }}</h1>
        <span class="status-badge" [ngClass]="order.status.toLowerCase()">{{ order.status }}</span>
      </div>

      <!-- Tracking Stepper -->
      <mat-card class="tracking-card premium-card">
        <mat-card-content>
          <mat-stepper [selectedIndex]="getStepIndex(order.status)" linear="true">
            <mat-step label="Processing" state="processing" [completed]="getStepIndex(order.status) >= 0"></mat-step>
            <mat-step label="Shipped" state="shipped" [completed]="getStepIndex(order.status) >= 1"></mat-step>
            <mat-step label="Delivered" state="delivered" [completed]="getStepIndex(order.status) >= 2"></mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>

      <div class="details-grid">
        <!-- Order Items -->
        <mat-card class="items-card premium-card">
          <mat-card-header>
            <mat-card-title>Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="order-item" *ngFor="let item of order.items">
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-meta">Qty: {{ item.quantity }}</span>
              </div>
              <span class="item-price">{{ item.price | currency:'EUR' }}</span>
            </div>
            <mat-divider></mat-divider>
            <div class="order-total">
              <span>Total</span>
              <span>{{ order.total | currency:'EUR' }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Shipping Info -->
        <mat-card class="shipping-card premium-card">
          <mat-card-header>
            <mat-card-title>Shipping Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <mat-icon>location_on</mat-icon>
              <div>
                <p class="label">Shipping Address</p>
                <p>{{ order.shippingAddress?.street }}</p>
                <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.zipCode }}</p>
                <p>{{ order.shippingAddress?.country }}</p>
              </div>
            </div>
            <div class="info-row">
              <mat-icon>calendar_today</mat-icon>
              <div>
                <p class="label">Order Date</p>
                <p>{{ order.date | date:'medium' }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-state">
        <p>Loading order details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .order-details-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      text-decoration: none;
      margin-right: auto;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
      color: #1a237e;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .status-badge.processing { background: #fff3e0; color: #ef6c00; }
    .status-badge.shipped { background: #e3f2fd; color: #1565c0; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }

    .tracking-card {
      margin-bottom: 32px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .details-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 500;
      color: #333;
    }

    .item-meta {
      font-size: 0.875rem;
      color: #666;
    }

    .order-total {
      display: flex;
      justify-content: space-between;
      padding-top: 16px;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a237e;
    }

    .info-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-row mat-icon {
      color: #666;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 4px;
    }

    .loading-state {
      text-align: center;
      padding: 64px;
      color: #666;
    }
  `]
})
export class OrderDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  order$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return this.store.select(selectAllOrders).pipe(
        map(orders => orders.find(o => o.id === id))
      );
    })
  );

  ngOnInit() {
    // Ensure orders are loaded (if deep linked)
    // this.store.dispatch(loadOrders()); // Assuming this action exists and handles loading
  }

  getStepIndex(status: string): number {
    switch (status) {
      case 'Processing': return 0;
      case 'Shipped': return 1;
      case 'Delivered': return 2;
      default: return 0;
    }
  }
}
