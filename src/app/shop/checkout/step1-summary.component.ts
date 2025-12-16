import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CheckoutStepperComponent } from './checkout-stepper.component';
import { selectCartItems, selectCartTotal } from '../../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-step1-summary',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatTableModule, CheckoutStepperComponent],
  template: `
    <div class="checkout-step">
      <app-checkout-stepper [currentStep]="1"></app-checkout-stepper>
      <h2>Order Summary</h2>
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="(cartItems$ | async) || []" class="summary-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Product</th>
              <td mat-cell *matCellDef="let item">{{ item.product.name }}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantity</th>
              <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let item">
                {{ item.product.price | number: '1.2-2' }} €
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let item">
                {{ item.product.price * item.quantity | number: '1.2-2' }} €
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div class="summary-total">
            <strong>Total: {{ cartTotal$ | async | number: '1.2-2' }} €</strong>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button routerLink="/shop/cart">Back to Cart</button>
          <button mat-raised-button color="primary" routerLink="/shop/checkout/address">
            Continue
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .checkout-step {
        max-width: 900px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .checkout-step h2 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin: var(--spacing-2xl) 0 var(--spacing-xl) 0;
        text-align: center;
        color: var(--color-text-primary);
      }

      .summary-table {
        width: 100%;
        margin-bottom: 1rem;
      }

      .summary-total {
        text-align: right;
        font-size: 1.5rem;
        padding: 1rem 0;
        border-top: 2px solid #eee;
        margin-top: 1rem;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
})
export class Step1SummaryComponent {
  private store = inject(Store);
  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total'];
}

