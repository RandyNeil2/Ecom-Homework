import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutLayoutComponent } from './checkout-layout.component';
import { CheckoutStepperComponent } from './checkout-stepper.component';

@Component({
  standalone: true,
  selector: 'app-step2-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CheckoutLayoutComponent,
    CheckoutStepperComponent
  ],
  template: `
    <app-checkout-layout>
      <div breadcrumbs>
        <app-checkout-stepper [currentStep]="2"></app-checkout-stepper>
      </div>

      <div class="step-content">
        <div class="section-header">
          <h2>Shipping Address</h2>
        </div>

        <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="address-form">
          <mat-form-field class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" placeholder="John Doe">
            <mat-error *ngIf="addressForm.get('fullName')?.hasError('required')">
              Full name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Address</mat-label>
            <input matInput formControlName="street" placeholder="123 Main St">
            <mat-error *ngIf="addressForm.get('street')?.hasError('required')">
              Address is required
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Apartment, suite, etc. (optional)</mat-label>
            <input matInput formControlName="apartment" placeholder="Apt 4B">
          </mat-form-field>

          <div class="form-row">
            <mat-form-field>
              <mat-label>Postal Code</mat-label>
              <input matInput formControlName="postalCode" placeholder="10001">
              <mat-error *ngIf="addressForm.get('postalCode')?.hasError('required')">
                Required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>City</mat-label>
              <input matInput formControlName="city" placeholder="New York">
              <mat-error *ngIf="addressForm.get('city')?.hasError('required')">
                Required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field class="full-width">
            <mat-label>Country</mat-label>
            <input matInput formControlName="country" placeholder="United States">
            <mat-error *ngIf="addressForm.get('country')?.hasError('required')">
              Country is required
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <a routerLink="/shop/cart" class="return-link">
              <mat-icon>arrow_back</mat-icon> Return to cart
            </a>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="continue-btn"
              [disabled]="!addressForm.valid"
            >
              Continue to shipping
            </button>
          </div>
        </form>
      </div>
    </app-checkout-layout>
  `,
  styles: [`
    .section-header {
      margin-bottom: 24px;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .address-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 640px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-actions {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 24px;
      margin-top: 32px;
    }

    @media (min-width: 640px) {
      .form-actions {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .return-link {
      color: var(--mat-sys-primary);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 500;
    }

    .return-link:hover {
      text-decoration: underline;
    }

    .continue-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
    }

    @media (min-width: 640px) {
      .continue-btn {
        width: auto;
        min-width: 200px;
      }
    }
  `]
})
export class Step2AddressComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  addressForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    street: ['', Validators.required],
    apartment: [''],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  onSubmit() {
    if (this.addressForm.valid) {
      sessionStorage.setItem('checkoutAddress', JSON.stringify(this.addressForm.value));
      this.router.navigate(['/shop/checkout/confirm']);
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
}

