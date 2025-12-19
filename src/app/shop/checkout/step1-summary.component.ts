import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CheckoutStepperComponent } from './checkout-stepper.component';
import { PromoCodeInputComponent } from '../promotions/promo-code-input.component';
import { selectCartItems, selectCartTotal, selectPromoCode, selectDiscount } from '../../state/cart/cart.selectors';
import * as CartActions from '../../state/cart/cart.actions';
import { take } from 'rxjs/operators';

interface PromoResponse {
  itemsTotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
  appliedPromos: string[];
  error?: string;
}

@Component({
  standalone: true,
  selector: 'app-step1-summary',
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatTableModule, 
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CheckoutStepperComponent,
    PromoCodeInputComponent
  ],
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

          <!-- Promo Code Section -->
          <div class="promo-section">
            <h3>Have a promo code?</h3>
            <app-promo-code-input (applyCode)="applyPromoCode($event)"></app-promo-code-input>
            
            <div *ngIf="promoLoading" class="promo-loading">
              <mat-spinner diameter="20"></mat-spinner>
              <span>Applying code...</span>
            </div>
            
            <div *ngIf="promoCode$ | async as code" class="applied-promo">
              <mat-icon>check_circle</mat-icon>
              <span>Promo code "{{ code }}" applied!</span>
              <button mat-icon-button (click)="removePromoCode()" aria-label="Remove promo code">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="price-breakdown">
            <div class="breakdown-row">
              <span>Subtotal</span>
              <span>{{ cartTotal$ | async | number: '1.2-2' }} €</span>
            </div>
            
            <div class="breakdown-row discount" *ngIf="(discount$ | async) as discount">
              <span>Discount</span>
              <span>-{{ discount | number: '1.2-2' }} €</span>
            </div>
            
            <div class="breakdown-row">
              <span>Shipping</span>
              <span>{{ promoResponse?.shipping ?? 5.99 | number: '1.2-2' }} €</span>
            </div>
            
            <div class="breakdown-row">
              <span>Taxes (20% VAT)</span>
              <span>{{ getTaxes() | number: '1.2-2' }} €</span>
            </div>
            
            <div class="breakdown-row total">
              <span>Total</span>
              <span>{{ getGrandTotal() | number: '1.2-2' }} €</span>
            </div>
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
  styles: [`
    .checkout-step {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .checkout-step h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 24px 0;
      text-align: center;
      color: #1a237e;
    }

    .summary-table {
      width: 100%;
      margin-bottom: 1rem;
    }

    .promo-section {
      margin: 24px 0;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .promo-section h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: #333;
    }

    .promo-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      color: #666;
    }

    .applied-promo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 12px;
      background: #e8f5e9;
      border-radius: 4px;
      color: #2e7d32;
    }

    .applied-promo mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .price-breakdown {
      padding: 16px 0;
      border-top: 2px solid #eee;
      margin-top: 16px;
    }

    .breakdown-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      color: #333;
    }

    .breakdown-row.discount {
      color: #2e7d32;
    }

    .breakdown-row.total {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a237e;
      border-top: 2px solid #1a237e;
      margin-top: 12px;
      padding-top: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
    }
  `],
})
export class Step1SummaryComponent {
  private store = inject(Store);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  
  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);
  promoCode$ = this.store.select(selectPromoCode);
  discount$ = this.store.select(selectDiscount);
  
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total'];
  promoLoading = false;
  promoResponse: PromoResponse | null = null;

  applyPromoCode(code: string) {
    this.promoLoading = true;
    
    this.cartItems$.pipe(take(1)).subscribe(items => {
      const cartData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        code
      };

      this.http.post<PromoResponse>('/api/cart/apply-promo/', cartData).subscribe({
        next: (response) => {
          this.promoLoading = false;
          if (response.error) {
            this.snackBar.open(response.error, 'Close', { duration: 5000 });
          } else {
            this.promoResponse = response;
            this.store.dispatch(CartActions.applyPromoCodeSuccess({ 
              code, 
              discount: response.discount 
            }));
          }
        },
        error: (err) => {
          this.promoLoading = false;
          const errorMsg = err.error?.error || 'Failed to apply promo code';
          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
          this.store.dispatch(CartActions.applyPromoCodeFailure({ error: errorMsg }));
        }
      });
    });
  }

  removePromoCode() {
    this.store.dispatch(CartActions.removePromoCode());
    this.promoResponse = null;
    this.snackBar.open('Promo code removed', 'Close', { duration: 3000 });
  }

  getTaxes(): number {
    if (this.promoResponse) {
      return this.promoResponse.taxes;
    }
    // Calculate based on cart total
    let subtotal = 0;
    this.cartTotal$.pipe(take(1)).subscribe(total => subtotal = total);
    return subtotal * 0.2;
  }

  getGrandTotal(): number {
    if (this.promoResponse) {
      return this.promoResponse.grandTotal;
    }
    let subtotal = 0;
    let discount = 0;
    this.cartTotal$.pipe(take(1)).subscribe(total => subtotal = total);
    this.discount$.pipe(take(1)).subscribe(d => discount = d);
    const shipping = 5.99;
    const taxes = (subtotal - discount) * 0.2;
    return subtotal - discount + shipping + taxes;
  }

  trackByItem(index: number, item: any): number {
    return item.product.id;
  }
}
