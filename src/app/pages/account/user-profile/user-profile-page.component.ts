import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

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
    MatIconModule
  ],
  template: `
    <div class="profile-edit-container">
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

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
            <div class="form-row">
              <mat-form-field>
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="John">
                <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field>
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Doe">
                <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                  Last name is required
                </mat-error>
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

            <mat-form-field class="full-width">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phone" placeholder="+1 (555) 000-0000">
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || profileForm.pristine">
                Save Changes
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
    }

    .edit-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 24px;
    }

    mat-card-header {
      margin-bottom: 32px;
    }

    mat-card-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1a237e;
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

    .profile-form {
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
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfilePageComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile updated', this.profileForm.value);
      // Dispatch update action here
    }
  }
}
