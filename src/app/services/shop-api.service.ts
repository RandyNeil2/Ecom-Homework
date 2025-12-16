import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsQueryParams, ProductsResponse } from '../state/products/products.actions';
import { Product, products } from '../../mocks/data';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export interface ProductRatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

export interface CartValidationResponse {
  valid: boolean;
  total: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export interface OrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  address: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderResponse {
  order_number: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ShopApiService {
  private productsKey = 'mock_products';

  constructor(private http: HttpClient) {
    this.initProducts();
  }

  private initProducts() {
    if (!localStorage.getItem(this.productsKey)) {
      localStorage.setItem(this.productsKey, JSON.stringify(products));
    }
  }

  private getStoredProducts(): Product[] {
    const stored = localStorage.getItem(this.productsKey);
    return stored ? JSON.parse(stored) : products;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // Mock login response
    return new Observable(observer => {
      setTimeout(() => {
        if (username && password) {
          observer.next({
            access: 'mock-access-token-' + Math.random().toString(36).substr(2),
            refresh: 'mock-refresh-token-' + Math.random().toString(36).substr(2)
          });
          observer.complete();
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  }

  register(name: string, email: string, password: string): Observable<LoginResponse> {
    // Mock register response
    return new Observable(observer => {
      setTimeout(() => {
        if (name && email && password) {
          observer.next({
            access: 'mock-access-token-' + Math.random().toString(36).substr(2),
            refresh: 'mock-refresh-token-' + Math.random().toString(36).substr(2)
          });
          observer.complete();
        } else {
          observer.error({ message: 'Registration failed' });
        }
      }, 1000);
    });
  }

  refresh(refreshToken: string): Observable<RefreshResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          access: 'mock-new-access-token-' + Math.random().toString(36).substr(2)
        });
        observer.complete();
      }, 500);
    });
  }

  getProducts(params: ProductsQueryParams): Observable<ProductsResponse> {
    // Mock getProducts response
    return new Observable(observer => {
      setTimeout(() => {
        let filteredProducts = this.getStoredProducts();

        // Filter by search
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.description.toLowerCase().includes(searchLower)
          );
        }

        // Filter by category
        if (params.category && params.category !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === params.category);
        }

        // Filter by price
        if (params.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
        }
        if (params.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
        }

        // Filter by rating
        if (params.minRating !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.rating >= params.minRating!);
        }

        // Sort
        if (params.ordering) {
          const direction = params.ordering.startsWith('-') ? -1 : 1;
          const field = params.ordering.replace('-', '');
          filteredProducts.sort((a: any, b: any) => {
            if (a[field] < b[field]) return -1 * direction;
            if (a[field] > b[field]) return 1 * direction;
            return 0;
          });
        }

        // Pagination
        const page = params.page || 1;
        const pageSize = params.pageSize || 12;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = filteredProducts.slice(start, end);

        observer.next({
          results: paginatedProducts,
          count: filteredProducts.length,
          next: end < filteredProducts.length ? `?page=${page + 1}` : null,
          previous: page > 1 ? `?page=${page - 1}` : null
        });
        observer.complete();
      }, 800);
    });
  }

  getRating(productId: number): Observable<ProductRatingResponse> {
    return this.http.get<ProductRatingResponse>(`/api/products/${productId}/rating/`);
  }

  getProduct(id: number): Observable<Product> {
    // Mock getProduct
    return new Observable(observer => {
      const product = this.getStoredProducts().find(p => p.id === id);
      if (product) {
        observer.next(product);
        observer.complete();
      } else {
        observer.error({ status: 404, detail: 'Product not found' });
      }
    });
    // return this.http.get<Product>(`/api/products/${id}`);
  }

  validateCart(items: Array<{ product_id: number; quantity: number }>): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>('/api/cart/validate', { items });
  }

  createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    // Update stock in mock storage
    const storedProducts = this.getStoredProducts();
    orderData.items.forEach(item => {
      const productIndex = storedProducts.findIndex(p => p.id === item.product_id);
      if (productIndex !== -1) {
        storedProducts[productIndex].stock = Math.max(0, storedProducts[productIndex].stock - item.quantity);
      }
    });
    localStorage.setItem(this.productsKey, JSON.stringify(storedProducts));

    return this.http.post<OrderResponse>('/api/order', orderData);
  }
}
