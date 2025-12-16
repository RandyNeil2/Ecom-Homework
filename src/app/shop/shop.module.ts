import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

// Components (Standalone)
import { ProductsPageComponent } from '../pages/products-page/products-page';
import { ProductDetailsPageComponent } from './product-details/product-details-page.component';
import { ProductRatingPageComponent } from '../pages/product-rating-page/product-rating-page';
import { CartPageComponent } from './cart/cart-page.component';
import { Step1SummaryComponent } from './checkout/step1-summary.component';
import { Step2AddressComponent } from './checkout/step2-address.component';
import { Step3ConfirmComponent } from './checkout/step3-confirm.component';
import { WishlistPageComponent } from './wishlist/wishlist-page.component';

const routes: Routes = [
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/:id', component: ProductDetailsPageComponent },
  { path: 'rating', component: ProductRatingPageComponent },
  { path: 'wishlist', component: WishlistPageComponent },
  { path: 'cart', component: CartPageComponent },
  {
    path: 'checkout',
    children: [
      { path: '', component: Step1SummaryComponent, canActivate: [authGuard] },
      { path: 'address', component: Step2AddressComponent, canActivate: [authGuard] },
      { path: 'confirm', component: Step3ConfirmComponent, canActivate: [authGuard] },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Import standalone components here if they are not already imported in the routes (Angular 15+ handles this in routes usually, but good to be explicit if we were using declarations)
    // Since they are standalone, we don't declare them. We just route to them.
    ProductsPageComponent,
    ProductDetailsPageComponent,
    ProductRatingPageComponent,
    CartPageComponent,
    Step1SummaryComponent,
    Step2AddressComponent,
    Step3ConfirmComponent,
    WishlistPageComponent
  ]
})
export class ShopModule { }
