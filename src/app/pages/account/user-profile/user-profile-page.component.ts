import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectUserProfile, selectUserLoading, selectUserError } from '../../../state/user/user.selectors';
import * as UserActions from '../../../state/user/user.actions';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-edit-container">
      <!-- Profile Card -->
      <mat-card class="edit-card">
        <mat-card-header>
          <mat-card-title>Edit Profile</mat-card-title>
          <mat-card-subtitle>Update your personal information</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="avatar-section">
            <div class="avatar-placeholder">
              <mat-icon>person</mat-icon>
            </div>
            <button mat-button color="primary">Change Photo</button>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmitProfile()" class="profile-form">
            <div class="form-row">
              <mat-form-field>
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="John Doe">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="+33 1 23 45 67 89">
              </mat-form-field>
            </div>
            
            <mat-form-field class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" placeholder="john.doe@example.com">
              <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <h3 class="section-title">Default Address</h3>
            
            <mat-form-field class="full-width">
              <mat-label>Street Address</mat-label>
              <input matInput formControlName="street" placeholder="123 Main Street">
            </mat-form-field>

            <div class="form-row">
              <mat-form-field>
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="Paris">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Postal Code</mat-label>
                <input matInput formControlName="postalCode" placeholder="75001">
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Country</mat-label>
              <input matInput formControlName="country" placeholder="France">
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="profileForm.invalid || profileForm.pristine || (loading$ | async)">
                <mat-spinner *ngIf="loading$ | async" diameter="20"></mat-spinner>
                <span *ngIf="!(loading$ | async)">Save Profile</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Preferences Card -->
      <mat-card class="preferences-card">
        <mat-card-header>
          <mat-card-title>Preferences</mat-card-title>
          <mat-card-subtitle>Customize your shopping experience</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="preferencesForm" (ngSubmit)="onSubmitPreferences()" class="preferences-form">
            <div class="preference-item">
              <div class="preference-info">
                <span class="preference-label">Newsletter Subscription</span>
                <span class="preference-description">Receive updates about new products and promotions</span>
              </div>
              <mat-slide-toggle formControlName="newsletter" color="primary"
                                aria-label="Toggle newsletter subscription">
              </mat-slide-toggle>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <span class="preference-label">Default Minimum Rating Filter</span>
                <span class="preference-description">Only show products with this rating or higher</span>
              </div>
              <mat-form-field class="rating-select">
                <mat-label>Min Rating</mat-label>
                <mat-select formControlName="defaultMinRating">
                  <mat-option [value]="null">No filter</mat-option>
                  <mat-option [value]="1">1+ ★</mat-option>
                  <mat-option [value]="2">2+ ★★</mat-option>
                  <mat-option [value]="3">3+ ★★★</mat-option>
                  <mat-option [value]="4">4+ ★★★★</mat-option>
                  <mat-option [value]="5">5 ★★★★★</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="preferencesForm.pristine || (loading$ | async)">
                <mat-spinner *ngIf="loading$ | async" diameter="20"></mat-spinner>
                <span *ngIf="!(loading$ | async)">Save Preferences</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-edit-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .edit-card, .preferences-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 24px;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    mat-card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a237e;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1a237e;
      margin: 24px 0 16px 0;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
    }

    .avatar-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .avatar-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1a237e;
    }

    .profile-form, .preferences-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
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

    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }

    .preference-item:last-of-type {
      border-bottom: none;
    }

    .preference-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preference-label {
      font-weight: 500;
      color: #333;
    }

    .preference-description {
      font-size: 0.875rem;
      color: #666;
    }

    .rating-select {
      width: 120px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    button[mat-raised-button] {
      padding: 0 32px;
      height: 48px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfilePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  userProfile$ = this.store.select(selectUserProfile);
  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);

  profileForm = this.fb.group({
    fullName: [''],
    phone: [''],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    city: [''],
    postalCode: [''],
    country: ['']
  });

  preferencesForm = this.fb.group({
    newsletter: [false],
    defaultMinRating: [null as number | null]
  });

  ngOnInit() {
    // Load user profile
    this.store.dispatch(UserActions.loadUserProfile());
    
    // Populate forms when profile loads
    this.userProfile$.subscribe(profile => {
      if (profile && profile.id) {
        this.profileForm.patchValue({
          fullName: profile.fullName || '',
          phone: profile.phone || '',
          email: profile.email || '',
          street: profile.defaultAddress?.street || '',
          city: profile.defaultAddress?.city || '',
          postalCode: profile.defaultAddress?.postalCode || '',
          country: profile.defaultAddress?.country || ''
        });
        
        this.preferencesForm.patchValue({
          newsletter: profile.preferences?.newsletter || false,
          defaultMinRating: profile.preferences?.defaultMinRating || null
        });

        // Mark forms as pristine after patching
        this.profileForm.markAsPristine();
        this.preferencesForm.markAsPristine();
      }
    });
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      this.store.dispatch(UserActions.updateUserProfile({
        updates: {
          fullName: formValue.fullName || undefined,
          phone: formValue.phone || undefined,
          email: formValue.email || undefined,
          defaultAddress: {
            street: formValue.street || '',
            city: formValue.city || '',
            postalCode: formValue.postalCode || '',
            country: formValue.country || ''
          }
        }
      }));
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      this.profileForm.markAsPristine();
    }
  }

  onSubmitPreferences() {
    const formValue = this.preferencesForm.value;
    this.store.dispatch(UserActions.updateUserPreferences({
      preferences: {
        newsletter: formValue.newsletter || false,
        defaultMinRating: formValue.defaultMinRating || undefined
      }
    }));
    this.snackBar.open('Preferences updated successfully!', 'Close', { duration: 3000 });
    this.preferencesForm.markAsPristine();
  }
}
