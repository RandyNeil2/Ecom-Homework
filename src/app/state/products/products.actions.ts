import { createAction, props } from '@ngrx/store';
import { Product } from '../../../mocks/data';

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  minRating?: number;
  ordering?: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ params: ProductsQueryParams }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ response: ProductsResponse; params: ProductsQueryParams }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const addProduct = createAction(
  '[Products] Add Product',
  props<{ product: Product }>()
);

