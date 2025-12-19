import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { selectAllOrders } from '../../../state/orders/orders.selectors';
import { loadOrders, Order } from '../../../state/orders/orders.actions';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-orders-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <h1>My Orders</h1>
        <p class="subtitle">Track and manage your recent purchases</p>
      </div>
      
      <mat-card class="orders-card">
        <div class="filters-section">
          <mat-form-field class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <mat-label>Search orders</mat-label>
            <input matInput placeholder="Order # or Product Name" 
                   [(ngModel)]="searchQuery" 
                   (ngModelChange)="onSearchChange($event)">
          </mat-form-field>

          <mat-form-field class="status-filter">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="selectedStatus" (selectionChange)="onStatusChange($event.value)">
              <mat-option value="all">All Statuses</mat-option>
              <mat-option value="Processing">Processing</mat-option>
              <mat-option value="Shipped">Shipped</mat-option>
              <mat-option value="Delivered">Delivered</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="(filteredOrders$ | async) || []" class="full-width">
            
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> Order # </th>
              <td mat-cell *matCellDef="let order" class="order-id"> {{order.orderNumber}} </td>
            </ng-container>
  
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Date </th>
              <td mat-cell *matCellDef="let order"> {{order.date | date:'mediumDate'}} </td>
            </ng-container>
  
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef> Total </th>
              <td mat-cell *matCellDef="let order" class="order-total"> {{order.total | currency:'EUR'}} </td>
            </ng-container>
  
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let order">
                <span class="status-badge" [ngClass]="order.status.toLowerCase()">
                  {{order.status}}
                </span>
              </td>
            </ng-container>
  
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> </th>
              <td mat-cell *matCellDef="let order">
                <a mat-stroked-button color="primary" [routerLink]="['/account/orders', order.id]">
                  View Details
                </a>
              </td>
            </ng-container>
  
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="order-row"></tr>
          </table>

          <div *ngIf="(filteredOrders$ | async)?.length === 0" class="empty-state">
            <mat-icon>shopping_bag</mat-icon>
            <p>No orders found</p>
            <p class="hint" *ngIf="selectedStatus !== 'all' || searchQuery">
              Try adjusting your filters
            </p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-page {
      padding: 32px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    .orders-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .filters-section {
      padding: 24px;
      display: flex;
      gap: 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .status-filter {
      width: 200px;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
      padding: 24px;
    }

    td.mat-cell {
      padding: 24px;
      color: #333;
      font-size: 0.95rem;
      border-bottom-color: #f0f0f0;
    }

    .order-id {
      font-family: monospace;
      font-weight: 600;
      color: #1a237e;
    }

    .order-total {
      font-weight: 600;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

    .order-row:hover {
      background: #fcfcfc;
    }

    .empty-state {
      padding: 64px 0;
      text-align: center;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state .hint {
      font-size: 0.9rem;
      margin-top: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListPageComponent implements OnInit {
  private store = inject(Store);
  
  orders$ = this.store.select(selectAllOrders);
  displayedColumns = ['id', 'date', 'total', 'status', 'actions'];
  
  // Filter state
  selectedStatus = 'all';
  searchQuery = '';
  
  private statusFilter$ = new BehaviorSubject<string>('all');
  private searchFilter$ = new BehaviorSubject<string>('');
  
  // Combined filtered orders
  filteredOrders$ = combineLatest([
    this.orders$,
    this.statusFilter$,
    this.searchFilter$
  ]).pipe(
    map(([orders, status, search]) => {
      return orders.filter(order => {
        // Status filter
        const matchesStatus = status === 'all' || order.status === status;
        
        // Search filter
        const searchLower = search.toLowerCase();
        const matchesSearch = !search || 
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some(item => item.productName.toLowerCase().includes(searchLower));
        
        return matchesStatus && matchesSearch;
      });
    })
  );

  ngOnInit() {
    this.store.dispatch(loadOrders());
  }
  
  onStatusChange(status: string) {
    this.statusFilter$.next(status);
  }
  
  onSearchChange(query: string) {
    this.searchFilter$.next(query);
  }
  
  trackByOrder(index: number, order: Order): string {
    return order.id;
  }
}
