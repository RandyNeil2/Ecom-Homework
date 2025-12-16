import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(({ params }) =>
        this.api.getProducts(params).pipe(
          map((response) =>
            ProductsActions.loadProductsSuccess({ response, params })
          ),
          catchError((error) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error?.message ?? 'Failed to load products',
              })
            )
          )
        )
      )
    )
  );
}

