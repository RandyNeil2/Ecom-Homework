import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { selectAllOrders } from '../../../state/orders/orders.selectors';
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
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  template: `
    <div class="order-details-page">
      <div class="page-header">
        <a routerLink="/account/orders" class="back-link" aria-label="Back to orders">
          <mat-icon>arrow_back</mat-icon>
          Back to Orders
        </a>
        <h1>Order Details</h1>
      </div>

      <ng-container *ngIf="order$ | async as order; else notFound">
        <!-- Order Info Card -->
        <mat-card class="info-card">
          <div class="order-header">
            <div>
              <h2 class="order-number">Order #{{ order.orderNumber }}</h2>
              <p class="order-date">Placed on {{ order.date | date:'longDate' }}</p>
            </div>
            <span class="status-badge" [ngClass]="order.status.toLowerCase()">
              {{ order.status }}
            </span>
          </div>
        </mat-card>

        <!-- Items Card -->
        <mat-card class="items-card">
          <mat-card-header>
            <mat-card-title>Order Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="order.items" class="items-table">
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Product</th>
                <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>Price</th>
                <td mat-cell *matCellDef="let item">{{ item.price | currency:'EUR' }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Qty</th>
                <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let item" class="item-total">
                  {{ item.price * item.quantity | currency:'EUR' }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Summary Card -->
        <div class="summary-grid">
          <!-- Shipping Address -->
          <mat-card class="address-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>location_on</mat-icon>
              <mat-card-title>Shipping Address</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p *ngIf="order.shippingAddress">
                {{ order.shippingAddress.street }}<br>
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.zipCode }}<br>
                {{ order.shippingAddress.country }}
              </p>
              <p *ngIf="!order.shippingAddress" class="no-address">
                No address information available
              </p>
            </mat-card-content>
          </mat-card>

          <!-- Order Summary -->
          <mat-card class="totals-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>receipt</mat-icon>
              <mat-card-title>Order Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ getSubtotal(order) | currency:'EUR' }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>{{ 5.99 | currency:'EUR' }}</span>
              </div>
              <div class="summary-row">
                <span>Taxes (20% VAT)</span>
                <span>{{ getTaxes(order) | currency:'EUR' }}</span>
              </div>
              <div class="summary-row discount" *ngIf="getDiscount(order) > 0">
                <span>Discount</span>
                <span>-{{ getDiscount(order) | currency:'EUR' }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ order.total | currency:'EUR' }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </ng-container>

      <ng-template #notFound>
        <mat-card class="not-found-card">
          <mat-card-content>
            <mat-icon>search_off</mat-icon>
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist or has been removed.</p>
            <a mat-raised-button color="primary" routerLink="/account/orders">
              View All Orders
            </a>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .order-details-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1565c0;
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 16px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    mat-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      margin-bottom: 24px;
    }

    .info-card {
      padding: 24px;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .order-number {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a237e;
      margin: 0 0 8px 0;
    }

    .order-date {
      color: #666;
      margin: 0;
    }

    .status-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.shipped {
      background: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.processing {
      background: #fff3e0;
      color: #ef6c00;
    }

    .status-badge.cancelled {
      background: #ffebee;
      color: #c62828;
    }

    .items-card mat-card-header {
      margin-bottom: 16px;
    }

    .items-table {
      width: 100%;
    }

    th.mat-header-cell {
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }

    .item-total {
      font-weight: 600;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .summary-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .address-card mat-card-content p {
      line-height: 1.8;
      color: #333;
    }

    .no-address {
      color: #999;
      font-style: italic;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a237e;
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px solid #1a237e;
      border-bottom: none;
    }

    .summary-row.discount {
      color: #2e7d32;
    }

    .not-found-card {
      text-align: center;
      padding: 48px;
    }

    .not-found-card mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .not-found-card h2 {
      color: #333;
      margin-bottom: 8px;
    }

    .not-found-card p {
      color: #666;
      margin-bottom: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  
  order$!: Observable<Order | undefined>;
  displayedColumns = ['product', 'price', 'quantity', 'total'];

  ngOnInit() {
    this.order$ = this.route.paramMap.pipe(
      switchMap(params => {
        const orderId = params.get('id');
        return this.store.select(selectAllOrders).pipe(
          map(orders => orders.find(o => o.id === orderId || o.orderNumber === orderId))
        );
      })
    );
  }

  getSubtotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTaxes(order: Order): number {
    const subtotal = this.getSubtotal(order);
    return subtotal * 0.2; // 20% VAT
  }

  getDiscount(order: Order): number {
    const subtotal = this.getSubtotal(order);
    const taxes = this.getTaxes(order);
    const shipping = 5.99;
    const calculatedTotal = subtotal + taxes + shipping;
    return Math.max(0, calculatedTotal - order.total);
  }

  trackByItem(index: number, item: any): number {
    return item.productId;
  }
}
