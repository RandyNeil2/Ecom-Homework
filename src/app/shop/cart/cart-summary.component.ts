import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-cart-summary',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="cart-summary">
      <mat-card-content>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span class="total">{{ total | number: '1.2-2' }} €</span>
        </div>
        <div class="summary-actions">
          <button mat-button (click)="onClear.emit()">Clear Cart</button>
          <button mat-raised-button color="primary" (click)="onCheckout.emit()">
            Proceed to Checkout
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .cart-summary {
        height: fit-content;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        font-size: 1.2rem;
        border-bottom: 1px solid #eee;
      }

      .summary-row .total {
        font-weight: bold;
        font-size: 1.5rem;
      }

      .summary-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class CartSummaryComponent {
  @Input() total = 0;
  @Output() onClear = new EventEmitter<void>();
  @Output() onCheckout = new EventEmitter<void>();
}

