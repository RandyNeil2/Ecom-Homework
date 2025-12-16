import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectCartCount } from '../../state/cart/cart.selectors';
import { selectAllNavigationItems } from '../../state/navigation/navigation.selectors';
import { selectIsLoggedIn } from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-shop-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  styles: [`
    .header-spacer {
      flex: 1 1 auto;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 1.5rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--mat-sys-on-primary);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-field {
      font-size: 14px;
      width: 300px;
      margin-left: 24px;
      margin-right: 24px;
    }
    ::ng-deep .search-field .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .mat-toolbar-single-row {
      height: 72px;
    }
    .nav-link {
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 0.875rem;
    }
  `],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z4">
      <a routerLink="/" class="logo">
        <mat-icon>diamond</mat-icon>
        <span>Luxe Shop</span>
      </a>
      
      <!-- Search Bar (Desktop) -->
      <mat-form-field appearance="outline" class="search-field hidden-mobile" density="compact">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Search for products...">
      </mat-form-field>

      <span class="header-spacer"></span>
      
      <!-- Desktop Navigation -->
      <ng-container *ngIf="visibleNavItems$ | async as navItems">
        <div class="hidden-mobile">
          <a
            *ngFor="let item of navItems"
            mat-button
            [routerLink]="item.path"
            routerLinkActive="active"
            class="nav-link"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }">
            {{ item.label }}
          </a>
        </div>
      </ng-container>
      
      <!-- Actions -->
      <a
        mat-icon-button
        routerLink="/shop/cart"
        routerLinkActive="active"
        [matBadge]="cartCount$ | async"
        [matBadgeHidden]="!(cartCount$ | async) || (cartCount$ | async) === 0"
        matBadgeColor="accent"
        matBadgeSize="small"
        aria-label="Shopping cart">
        <mat-icon>shopping_bag</mat-icon>
      </a>
      
      <ng-container *ngIf="!(isLoggedIn$ | async)">
        <a mat-button routerLink="/login" class="hidden-mobile">Login</a>
        <a mat-raised-button color="accent" routerLink="/register" class="hidden-mobile" style="margin-left: 8px;">Register</a>
      </ng-container>
      
      <button
        *ngIf="isLoggedIn$ | async"
        mat-icon-button
        [matMenuTriggerFor]="userMenu"
        aria-label="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>
      
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/account">
          <mat-icon>person</mat-icon>
          <span>My Account</span>
        </button>
        <button mat-menu-item routerLink="/account/orders">
          <mat-icon>receipt_long</mat-icon>
          <span>My Orders</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
})
export class ShopHeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  allNavItems$ = this.store.select(selectAllNavigationItems);
  cartCount$ = this.store.select(selectCartCount);

  visibleNavItems$ = combineLatest([
    this.allNavItems$,
    this.isLoggedIn$,
  ]).pipe(
    map(([items, isLoggedIn]) =>
      items.filter((item) => {
        if (item.requiresAuth && !isLoggedIn) return false;
        if (item.showWhenLoggedIn && !isLoggedIn) return false;
        if (item.showWhenLoggedOut && isLoggedIn) return false;
        return true;
      })
    )
  );

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/']);
  }
}

