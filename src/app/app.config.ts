import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { authReducer } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { productsReducer } from './state/products/products.reducer';
import { ProductsEffects } from './state/products/products.effects';
import { cartReducer } from './state/cart/cart.reducer';
import { CartEffects } from './state/cart/cart.effects';
import { ordersReducer } from './state/orders/orders.reducer';
import { OrdersEffects } from './state/orders/orders.effects';
import { navigationReducer } from './state/navigation/navigation.reducer';

import { wishlistReducer } from './state/wishlist/wishlist.reducer';
import { WishlistEffects } from './state/wishlist/wishlist.effects';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { NotificationEffects } from './state/notification.effects';

import { userReducer } from './state/user/user.reducer';
import { UserEffects } from './state/user/user.effects';
import { adminReducer } from './state/admin/admin.reducer';
import { AdminEffects } from './state/admin/admin.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ⬇️ HERE: register your feature state
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      orders: ordersReducer,
      navigation: navigationReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      user: userReducer,
      admin: adminReducer,
    }),
    provideEffects([
      AuthEffects, 
      ProductsEffects, 
      CartEffects, 
      OrdersEffects,
      WishlistEffects, 
      ReviewsEffects, 
      NotificationEffects,
      UserEffects,
      AdminEffects
    ]),

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};

