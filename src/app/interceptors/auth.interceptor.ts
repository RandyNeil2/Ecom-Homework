import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../state/auth/auth.selectors';
import { take, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Skip adding token for auth endpoints
  if (req.url.includes('/api/auth/token/')) {
    return next(req);
  }

  return store.select(selectAuthState).pipe(
    take(1),
    switchMap((authState) => {
      if (authState.access) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authState.access}`,
          },
        });
        return next(clonedReq);
      }
      return next(req);
    })
  );
};

