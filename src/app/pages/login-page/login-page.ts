import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import * as AuthActions from '../../state/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
} from '../../state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form = this.fb.group({
    username: ['demo', Validators.required],
    password: ['demo', Validators.required],
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.getRawValue();
    this.store.dispatch(
      AuthActions.login({
        username: username ?? '',
        password: password ?? '',
      })
    );
  }
}
