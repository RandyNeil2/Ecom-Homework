import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';

import { LoginPageComponent } from './pages/login-page/login-page';
import { LoginPagePremiumComponent } from './pages/auth/login-page-premium.component';
import { RegisterPagePremiumComponent } from './pages/auth/register-page-premium.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AccountDashboardComponent } from './pages/account/account-dashboard.component';
import { ProductsPageComponent } from './pages/products-page/products-page';
import { ProductRatingPageComponent } from './pages/product-rating-page/product-rating-page';
import { CartPageComponent } from './shop/cart/cart-page.component';
import { ProductDetailsPageComponent } from './shop/product-details/product-details-page.component';
import { Step1SummaryComponent } from './shop/checkout/step1-summary.component';
import { Step2AddressComponent } from './shop/checkout/step2-address.component';
import { Step3ConfirmComponent } from './shop/checkout/step3-confirm.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // DEV playground (already in project – keep it)
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },

  // Placeholder for the real app (already in project)
  { path: 'app', component: AppPlaceholderComponent },

  // 👉 Exo pages
  { path: 'login', component: LoginPagePremiumComponent },
  { path: 'register', component: RegisterPagePremiumComponent },
  
  // Lazy Loaded Modules
  { 
    path: 'account', 
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
    canActivate: [authGuard]
  },
  { 
    path: 'shop', 
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) 
    // Removed authGuard to allow guest access
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard] // Protect admin route
  },

  { path: '**', redirectTo: '' },
];
