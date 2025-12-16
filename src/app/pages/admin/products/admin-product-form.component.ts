import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { addProduct } from '../../../state/products/products.actions';

@Component({
  // ... (selector and imports remain same)
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule
  ],
  template: `
    <!-- ... template remains same ... -->
    <div class="admin-form-container">
      <mat-card class="premium-card">
        <mat-card-header>
          <mat-card-title>Add New Product</mat-card-title>
          <mat-card-subtitle>Enter professional product details</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
            
            <!-- Basic Info -->
            <div class="form-section">
              <h3>Basic Information</h3>
              <div class="form-row">
                <mat-form-field appearance="fill">
                  <mat-label>Product Name</mat-label>
                  <input matInput formControlName="name" placeholder="e.g. Premium Fountain Pen">
                  <mat-error *ngIf="productForm.get('name')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Category</mat-label>
                  <mat-select formControlName="category">
                    <mat-option value="Stationery">Stationery</mat-option>
                    <mat-option value="Office">Office</mat-option>
                    <mat-option value="Art">Art</mat-option>
                    <mat-option value="Accessories">Accessories</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="fill">
                  <mat-label>Price (€)</mat-label>
                  <input matInput type="number" formControlName="price" placeholder="0.00">
                  <mat-error *ngIf="productForm.get('price')?.hasError('min')">Price must be positive</mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Stock Quantity</mat-label>
                  <input matInput type="number" formControlName="stock" placeholder="0">
                  <mat-error *ngIf="productForm.get('stock')?.hasError('min')">Stock cannot be negative</mat-error>
                </mat-form-field>
              </div>
            </div>

            <!-- Details -->
            <div class="form-section">
              <h3>Details</h3>
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="4" placeholder="Detailed product description..."></textarea>
              </mat-form-field>

              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Image URL</mat-label>
                <input matInput formControlName="image" placeholder="https://...">
              </mat-form-field>
            </div>

            <!-- Features -->
            <div class="form-section">
              <div class="section-header">
                <h3>Features</h3>
                <button mat-button type="button" color="primary" (click)="addFeature()">
                  <mat-icon>add</mat-icon> Add Feature
                </button>
              </div>
              
              <div formArrayName="features" class="features-list">
                <div *ngFor="let feature of features.controls; let i=index" class="feature-row">
                  <mat-form-field appearance="fill" class="feature-input">
                    <mat-label>Feature {{i + 1}}</mat-label>
                    <input matInput [formControlName]="i" placeholder="e.g. Ergonomic grip">
                  </mat-form-field>
                  <button mat-icon-button color="warn" type="button" (click)="removeFeature(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/admin">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid">
                Create Product
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-form-container {
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      font-size: 1.25rem;
      color: #1a237e;
      margin-bottom: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 600px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .full-width {
      width: 100%;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .feature-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feature-input {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
  `]
})
export class AdminProductFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(Store);

  productForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    image: ['', Validators.required],
    features: this.fb.array([
      this.fb.control('')
    ])
  });

  get features() {
    return this.productForm.get('features') as FormArray;
  }

  addFeature() {
    this.features.push(this.fb.control(''));
  }

  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const newProduct: any = {
        id: Math.floor(Math.random() * 10000) + 100, // Random ID for mock
        name: formValue.name,
        category: formValue.category,
        price: formValue.price,
        stock: formValue.stock,
        description: formValue.description,
        image: formValue.image,
        features: formValue.features as string[],
        rating: 0,
        ratings: [],
        created_at: new Date().toISOString(),
        owner_id: 1 // Admin
      };

      // Dispatch action (we need to inject Store first)
      this.store.dispatch(addProduct({ product: newProduct }));
      this.router.navigate(['/admin']);
    }
  }
}
