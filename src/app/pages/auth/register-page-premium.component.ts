import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../components/layout/header.component';
import { FloatingInputComponent } from '../../components/ui/floating-input.component';
import * as AuthActions from '../../state/auth/auth.actions';

@Component({
  selector: 'app-register-page-premium',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FloatingInputComponent
  ],
  template: `

    
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create an account</h1>
          <p>Join us to access exclusive offers and features.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <app-floating-input
            label="Full Name"
            type="text"
            formControlName="name"
            [error]="getErrorMessage('name')"
          ></app-floating-input>

          <app-floating-input
            label="Email"
            type="email"
            formControlName="email"
            [error]="getErrorMessage('email')"
          ></app-floating-input>

          <app-floating-input
            label="Password"
            type="password"
            formControlName="password"
            [error]="getErrorMessage('password')"
          ></app-floating-input>

          <app-floating-input
            label="Confirm Password"
            type="password"
            formControlName="confirmPassword"
            [error]="getErrorMessage('confirmPassword')"
          ></app-floating-input>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="terms">
              <span>I agree to the <a href="#">Terms of Service</a></span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>

          <div class="divider">
            <span>Or sign up with</span>
          </div>

          <button type="button" class="btn btn-secondary google-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20">
            Google
          </button>

          <p class="auth-footer">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      padding: 2rem 1rem;
    }

    .auth-card {
      background: white;
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6b7280;
      font-size: 0.9375rem;
    }

    .form-options {
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4b5563;
      cursor: pointer;
    }

    .checkbox-label a {
      color: #111827;
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 0.875rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.9375rem;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #111827;
      color: white;
      border: 1px solid #111827;
    }

    .btn-primary:hover:not(:disabled) {
      background: #000;
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .divider {
      margin: 1.5rem 0;
      text-align: center;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      background: white;
      padding: 0 0.75rem;
      color: #6b7280;
      font-size: 0.875rem;
      position: relative;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #e5e7eb;
      color: #1f2937;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9375rem;
    }

    .auth-footer a {
      color: #111827;
      font-weight: 600;
    }
  `]
})
export class RegisterPagePremiumComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  isLoading = false;

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  });

  getErrorMessage(controlName: string): string | null {
    const control = this.registerForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      if (control.errors['email']) return 'Invalid email address';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { name, email, password } = this.registerForm.value;
      
      // Simulate API call
      this.store.dispatch(AuthActions.register({ name, email, password }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
