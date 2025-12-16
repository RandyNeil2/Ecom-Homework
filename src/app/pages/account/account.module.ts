import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

// Components
import { AccountDashboardComponent } from './account-dashboard.component';
// We will create these later, but defining routes now
// import { UserProfilePageComponent } from './user-profile/user-profile-page.component';
// import { OrdersListPageComponent } from './orders/orders-list-page.component';
// import { OrderDetailsPageComponent } from './orders/order-details-page.component';

const routes: Routes = [
  { 
    path: '', 
    component: AccountDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', loadComponent: () => import('./user-profile/user-profile-page.component').then(m => m.UserProfilePageComponent) },
      { path: 'orders', loadComponent: () => import('./orders/orders-list-page.component').then(m => m.OrdersListPageComponent) },
      { path: 'orders/:id', loadComponent: () => import('./orders/order-details-page.component').then(m => m.OrderDetailsPageComponent) },
      { path: 'wishlist', loadComponent: () => import('./wishlist/wishlist-page.component').then(m => m.WishlistPageComponent) }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AccountDashboardComponent
  ]
})
export class AccountModule { }
