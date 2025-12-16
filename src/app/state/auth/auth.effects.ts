import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class AuthEffects {
  // ✅ inject() works safely with class field initializers
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);

  // Effect: login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.api.login(username, password).pipe(
          map(({ access, refresh }) => {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            return AuthActions.loginSuccess({ access, refresh });
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.message ?? 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ name, email, password }) =>
        this.api.register(name, email, password).pipe(
          map(({ access, refresh }) =>
            AuthActions.loginSuccess({ access, refresh })
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.message ?? 'Registration failed',
              })
            )
          )
        )
      )
    )
  );

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  private router = inject(Router);
}
