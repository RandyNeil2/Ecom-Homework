import { Component, inject, signal, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../state/cart/cart.selectors';
import { selectIsLoggedIn, selectUser } from '../../state/auth/auth.selectors';
import { selectUniqueCategories } from '../../state/products/products.selectors';
import * as AuthActions from '../../state/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
   <header class="site-header" [class.scrolled]="isScrolled">
  <div class="container">
    <div class="header-content">

      <!-- Mobile Menu Button -->
      <button mat-icon-button class="mobile-menu-btn" (click)="toggleMobileMenu()">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Logo -->
      <a routerLink="/" class="logo">
        <span class="logo-text">
          Z-<span class="logo-accent">Kstore</span>
        </span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="main-nav">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-link"
        >
          HOME
        </a>

        <div
          class="nav-item-dropdown"
          (mouseenter)="showShopMenu = true"
          (mouseleave)="showShopMenu = false"
        >
          <a routerLink="/shop/products" routerLinkActive="active" class="nav-link">
            SHOP
            <mat-icon class="dropdown-icon">expand_more</mat-icon>
          </a>

          <div class="mega-menu" *ngIf="showShopMenu">
            <div class="mega-menu-content">
              <div class="menu-column">
                <h3>COLLECTIONS</h3>
                <a routerLink="/shop/products" [queryParams]="{ category: 'new' }">New Arrivals</a>
                <a routerLink="/shop/products" [queryParams]="{ category: 'bestsellers' }">Best Sellers</a>
                <a routerLink="/shop/products" [queryParams]="{ category: 'featured' }">Featured</a>
                <a routerLink="/shop/products" [queryParams]="{ category: 'sale' }">Sale</a>
              </div>

              <div class="menu-column">
                <h3>CATEGORIES</h3>
                <a
                  *ngFor="let category of categories$ | async"
                  routerLink="/shop/products"
                  [queryParams]="{ category: category }"
                >
                  {{ category }}
                </a>
              </div>

              <div class="menu-column featured-column">
                <div class="featured-card">
                  <div class="featured-text">
                    <h4>Summer Collection</h4>
                    <p>Discover the new trends</p>
                    <a routerLink="/shop/products" class="btn-link">Shop Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a routerLink="/about" routerLinkActive="active" class="nav-link">ABOUT</a>
        <a routerLink="/contact" routerLinkActive="active" class="nav-link">CONTACT</a>
      </nav>

      <!-- Actions -->
      <div class="header-actions">
        <button mat-icon-button class="action-btn">
          <mat-icon>search</mat-icon>
        </button>

        <ng-container *ngIf="isLoggedIn$ | async; else authButtons">
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="action-btn">
            <mat-icon>person</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <a *ngIf="(user$ | async)?.isAdmin" routerLink="/admin" mat-menu-item>
              <mat-icon>admin_panel_settings</mat-icon>
              Admin Panel
            </a>
            <a routerLink="/account" mat-menu-item>
              <mat-icon>dashboard</mat-icon>
              Dashboard
            </a>
            <a routerLink="/account/orders" mat-menu-item>
              <mat-icon>shopping_bag</mat-icon>
              My Orders
            </a>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </ng-container>

        <ng-template #authButtons>
          <div class="auth-buttons">
            <a routerLink="/login" class="nav-link-small">Login</a>
            <a routerLink="/register" class="btn-register">Register</a>
          </div>
        </ng-template>

        <a routerLink="/shop/cart" mat-icon-button class="action-btn">
          <mat-icon
            [matBadge]="cartCount$ | async"
            [matBadgeHidden]="(cartCount$ | async) === 0"
            matBadgeColor="warn"
          >
            shopping_cart
          </mat-icon>
        </a>
      </div>
    </div>
  </div>

  <div class="mobile-menu-overlay" *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>

  <div class="mobile-menu-drawer" [class.open]="isMobileMenuOpen">
    <div class="drawer-header">
      <span class="logo-text">Z-<span class="logo-accent">Kstore</span></span>
      <button mat-icon-button (click)="toggleMobileMenu()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <nav class="mobile-nav">
      <a routerLink="/" (click)="toggleMobileMenu()">HOME</a>
      <a routerLink="/shop/products" (click)="toggleMobileMenu()">SHOP</a>
      <a routerLink="/about" (click)="toggleMobileMenu()">ABOUT</a>
      <a routerLink="/contact" (click)="toggleMobileMenu()">CONTACT</a>
    </nav>
  </div>
</header>

  `,
  styles: [`
    .site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 88px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 184, 0, 0.25);
  z-index: 1000;
  transition: all 0.3s ease;
}

.site-header.scrolled {
  height: 76px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Logo */

.logo {
  text-decoration: none;
}

.logo-text {
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #1e1e1e;
}

.logo-accent {
  color: #ffb800;
}

/* Navigation */

.main-nav {
  display: none;
  gap: 2.5rem;
}

@media (min-width: 992px) {
  .main-nav {
    display: flex;
  }
}

.nav-link {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
  text-decoration: none;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #ffb800;
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

/* Mega menu */

.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem 0;
  z-index: 2000;
}

.mega-menu-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}

/* Actions */

.header-actions {
  display: flex;
  gap: 1.25rem;
}

.action-btn {
  color: #333;
}

.action-btn:hover {
  color: #ffb800;
}

/* Mobile */

.mobile-menu-btn {
  color: #333;
}

@media (min-width: 992px) {
  .mobile-menu-btn {
    display: none;
  }
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1001;
}

.mobile-menu-drawer {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background: #fff;
  transition: left 0.3s ease;
  z-index: 1002;
}

.mobile-menu-drawer.open {
  left: 0;
}

  `]
})
export class HeaderComponent {
  private router = inject(Router);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  
  cartCount$ = this.store.select(selectCartCount);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  user$ = this.store.select(selectUser);
  categories$ = this.store.select(selectUniqueCategories);
  
  showShopMenu = false;
  isMobileMenuOpen = false;
  isScrolled = false;

  constructor() {
    // Check initial state
    this.checkScroll();

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkScroll();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const url = this.router.url.split('?')[0];
    const isHome = url === '/' || url === '/home';
    
    const newIsScrolled = scrollPosition > 20 || !isHome;
    
    if (this.isScrolled !== newIsScrolled) {
      this.isScrolled = newIsScrolled;
      this.cdr.markForCheck(); // Force update
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
