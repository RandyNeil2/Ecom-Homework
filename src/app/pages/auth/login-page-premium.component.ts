import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../components/layout/header.component';
import { FloatingInputComponent } from '../../components/ui/floating-input.component';
import * as AuthActions from '../../state/auth/auth.actions';

@Component({
  selector: 'app-login-page-premium',
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
          <h1>Welcome back</h1>
          <p>Please enter your details to sign in.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox">
              <span>Remember me</span>
            </label>
            <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>

          <div class="divider">
            <span>Or continue with</span>
          </div>

          <button type="button" class="btn btn-secondary google-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20">
            Google
          </button>

          <p class="auth-footer">
            Don't have an account? <a routerLink="/register">Sign up</a>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .forgot-link {
      color: #111827;
      font-weight: 500;
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
export class LoginPagePremiumComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      if (control.errors['email']) return 'Invalid email address';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      // Simulate API call
      this.store.dispatch(AuthActions.login({ username: email, password }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
