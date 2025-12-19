import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import * as AuthActions from '../auth/auth.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserProfile),
      switchMap(() =>
        this.http.get<UserActions.UserProfile>('/api/me/').pipe(
          map((user) => UserActions.loadUserProfileSuccess({ user })),
          catchError((error) =>
            of(UserActions.loadUserProfileFailure({ error: error.message || 'Failed to load profile' }))
          )
        )
      )
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserProfile),
      switchMap(({ updates }) =>
        this.http.patch<UserActions.UserProfile>('/api/me/', updates).pipe(
          map((user) => UserActions.updateUserProfileSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserProfileFailure({ error: error.message || 'Failed to update profile' }))
          )
        )
      )
    )
  );

  updateUserPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPreferences),
      switchMap(({ preferences }) =>
        this.http.patch<{ preferences: UserActions.UserPreferences }>('/api/me/', { preferences }).pipe(
          map((response) => UserActions.updateUserPreferencesSuccess({ preferences: response.preferences })),
          catchError((error) =>
            of(UserActions.updateUserPreferencesFailure({ error: error.message || 'Failed to update preferences' }))
          )
        )
      )
    )
  );

  // Load user profile when login is successful
  loadOnLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => UserActions.loadUserProfile())
    )
  );

  // Clear user on logout
  clearOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => UserActions.clearUser())
    )
  );
}
