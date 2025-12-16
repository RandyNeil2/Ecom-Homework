import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { AdminStatsCardComponent } from './admin-stats-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    RouterModule,
    AdminStatsCardComponent
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p class="subtitle">Overview of your store's performance</p>
        </div>
        <div class="actions">
          <button mat-raised-button color="accent" routerLink="/admin/products/new" class="action-btn">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button mat-raised-button color="primary" class="action-btn">
            <mat-icon>download</mat-icon>
            Download Report
          </button>
        </div>
      </div>
      
      <div class="stats-grid">
        <app-admin-stats-card
          title="Total Revenue"
          value="€12,345.00"
          icon="attach_money"
          color="primary"
          [trend]="15">
        </app-admin-stats-card>

        <app-admin-stats-card
          title="Total Orders"
          value="156"
          icon="shopping_cart"
          color="accent"
          [trend]="8">
        </app-admin-stats-card>

        <app-admin-stats-card
          title="Active Users"
          value="1,234"
          icon="people"
          color="warn"
          [trend]="-2">
        </app-admin-stats-card>

        <app-admin-stats-card
          title="Avg. Order Value"
          value="€79.13"
          icon="analytics"
          color="primary"
          [trend]="5">
        </app-admin-stats-card>
      </div>

      <div class="recent-orders">
        <div class="section-header">
          <h2>Recent Orders</h2>
          <button mat-button color="primary">View All</button>
        </div>
        
        <mat-card class="table-card">
          <table mat-table [dataSource]="recentOrders" class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> Order ID </th>
              <td mat-cell *matCellDef="let order" class="order-id"> {{order.id}} </td>
            </ng-container>
            
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef> Customer </th>
              <td mat-cell *matCellDef="let order"> 
                <div class="customer-cell">
                  <div class="customer-avatar">{{order.customer.charAt(0)}}</div>
                  <span>{{order.customer}}</span>
                </div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef> Total </th>
              <td mat-cell *matCellDef="let order" class="order-total"> {{order.total | currency:'EUR'}} </td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let order">
                <mat-chip [color]="getStatusColor(order.status)" selected>
                  {{order.status}}
                </mat-chip>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="order-row"></tr>
          </table>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    .action-btn {
      border-radius: 24px;
      padding: 0 24px;
      height: 48px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 1.5rem;
      color: #1a237e;
      margin: 0;
    }

    .table-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .full-width { width: 100%; }

    th.mat-header-cell {
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
      padding: 24px;
      background: #f8f9fa;
    }

    td.mat-cell {
      padding: 20px 24px;
      color: #333;
      font-size: 0.95rem;
      border-bottom-color: #f0f0f0;
    }

    .order-id {
      font-family: monospace;
      font-weight: 600;
      color: #1a237e;
    }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .customer-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1565c0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .order-total {
      font-weight: 600;
    }

    .order-row:hover {
      background: #fcfcfc;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  displayedColumns = ['id', 'customer', 'total', 'status'];
  recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', total: 120.50, status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', total: 85.00, status: 'Processing' },
    { id: '#ORD-003', customer: 'Bob Johnson', total: 250.00, status: 'Shipped' },
    { id: '#ORD-004', customer: 'Alice Brown', total: 320.00, status: 'Completed' },
    { id: '#ORD-005', customer: 'Charlie Wilson', total: 55.00, status: 'Processing' },
  ];

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'accent';
      case 'shipped': return 'primary';
      case 'processing': return 'warn';
      default: return '';
    }
  }
}
