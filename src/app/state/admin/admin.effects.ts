import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as AdminActions from './admin.actions';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadAdminStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminStats),
      switchMap(() =>
        this.http.get<AdminActions.AdminStats>('/api/admin/stats/').pipe(
          map((stats) => AdminActions.loadAdminStatsSuccess({ stats })),
          catchError((error) =>
            of(AdminActions.loadAdminStatsFailure({ error: error.message || 'Failed to load stats' }))
          )
        )
      )
    )
  );
}
