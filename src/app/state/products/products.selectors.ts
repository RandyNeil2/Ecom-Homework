import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProductsList = createSelector(
  selectProductsState,
  (state) => state.list
);

export const selectProductsCount = createSelector(
  selectProductsState,
  (state) => state.count
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectLastQueryParams = createSelector(
  selectProductsState,
  (state) => state.lastQueryParams
);

export const selectUniqueCategories = createSelector(
  selectProductsList,
  (products) => {
    const categories = products.map(p => p.category);
    return [...new Set(categories)].sort();
  }
);

