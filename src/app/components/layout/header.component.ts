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
import { selectIsLoggedIn } from '../../state/auth/auth.selectors';
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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="https://img.icons8.com/?size=100&id=aXqZuBnZjITM&format=png&color=000000" class="logo-icon">
              <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="logo-text">Z-<span class="logo-accent">Kstore</span></span>
          </a>

          <!-- Desktop Navigation -->
          <nav class="main-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">HOME</a>
            
            <!-- Shop Mega Menu Trigger -->
            <div class="nav-item-dropdown" (mouseenter)="showShopMenu = true" (mouseleave)="showShopMenu = false">
              <a routerLink="/shop/products" routerLinkActive="active" class="nav-link">
                SHOP <mat-icon class="dropdown-icon">expand_more</mat-icon>
              </a>
              
              <!-- Mega Menu -->
              <div class="mega-menu" *ngIf="showShopMenu">
                <div class="mega-menu-content">
                  <div class="menu-column">
                    <h3>COLLECTIONS</h3>
                    <a routerLink="/shop/products" [queryParams]="{category: 'new'}">New Arrivals</a>
                    <a routerLink="/shop/products" [queryParams]="{category: 'bestsellers'}">Best Sellers</a>
                    <a routerLink="/shop/products" [queryParams]="{category: 'featured'}">Featured</a>
                    <a routerLink="/shop/products" [queryParams]="{category: 'sale'}">Sale</a>
                  </div>
                  <div class="menu-column">
                    <h3>CATEGORIES</h3>
                    <a *ngFor="let category of categories$ | async" 
                       routerLink="/shop/products" 
                       [queryParams]="{category: category}">
                       {{ category }}
                    </a>
                  </div>
                  <div class="menu-column featured-column">
                    <div class="featured-card">
                      <div class="featured-image"></div>
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
            <button mat-icon-button class="action-btn search-btn">
              <mat-icon>search</mat-icon>
            </button>
            
            <ng-container *ngIf="isLoggedIn$ | async; else authButtons">
              <button mat-icon-button [matMenuTriggerFor]="userMenu" class="action-btn">
                <mat-icon>person</mat-icon>
              </button>
              <mat-menu #userMenu="matMenu" class="premium-menu">
                <a routerLink="/account" mat-menu-item>
                  <mat-icon>dashboard</mat-icon>
                  <span>Dashboard</span>
                </a>
                <a routerLink="/account/orders" mat-menu-item>
                  <mat-icon>shopping_bag</mat-icon>
                  <span>My Orders</span>
                </a>
                <button mat-menu-item (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  <span>Logout</span>
                </button>
              </mat-menu>
            </ng-container>

            <ng-template #authButtons>
              <div class="auth-buttons">
                <a routerLink="/login" class="nav-link-small">Login</a>
                <a routerLink="/register" class="btn-register">Register</a>
              </div>
            </ng-template>

            <a routerLink="/shop/wishlist" mat-icon-button class="action-btn wishlist-btn">
              <mat-icon>favorite_border</mat-icon>
            </a>

            <a routerLink="/shop/cart" mat-icon-button class="action-btn cart-btn">
              <mat-icon [matBadge]="cartCount$ | async" [matBadgeHidden]="(cartCount$ | async) === 0" matBadgeColor="warn">
                shopping_cart
              </mat-icon>
            </a>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>
      
      <!-- Mobile Menu Drawer -->
      <div class="mobile-menu-drawer" [class.open]="isMobileMenuOpen">
        <div class="drawer-header">
          <div class="logo-mobile">
            <span class="logo-text">LUXE</span><span class="logo-accent">SHOP</span>
          </div>
          <button mat-icon-button (click)="toggleMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <nav class="mobile-nav">
          <a routerLink="/" (click)="toggleMobileMenu()">HOME</a>
          <a routerLink="/shop/products" (click)="toggleMobileMenu()">SHOP</a>
          <a routerLink="/about" (click)="toggleMobileMenu()">ABOUT</a>
          <a routerLink="/contact" (click)="toggleMobileMenu()">CONTACT</a>
          <div class="divider"></div>
          <ng-container *ngIf="isLoggedIn$ | async; else mobileAuth">
            <a routerLink="/account" (click)="toggleMobileMenu()">MY ACCOUNT</a>
            <a (click)="logout(); toggleMobileMenu()">LOGOUT</a>
          </ng-container>
          <ng-template #mobileAuth>
            <a routerLink="/login" (click)="toggleMobileMenu()">LOGIN</a>
            <a routerLink="/register" (click)="toggleMobileMenu()">REGISTER</a>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .site-header {
      background: transparent;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      height: 90px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .site-header.scrolled {
      background: #ffffff !important;
      height: 80px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      border-bottom: none;
    }
    
    .site-header.scrolled .logo-icon path {
      stroke: #000000 !important;
    }
    
    .site-header.scrolled .logo-text {
      color: #000000 !important;
    }
    
    .site-header.scrolled .nav-link {
      color: #000000 !important;
    }
    
    .site-header.scrolled .nav-link:hover,
    .site-header.scrolled .nav-link.active {
      color: #000000 !important;
      opacity: 0.7;
    }
    
    .site-header.scrolled .action-btn {
      color: #000000 !important;
    }
    
    .site-header.scrolled .nav-link-small {
      color: #000000 !important;
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
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    
    .logo:hover {
      transform: scale(1.02);
    }
    
    .logo-icon {
      color: white;
      transition: color 0.4s ease;
    }
    
    .logo-icon path {
      stroke: white;
      transition: stroke 0.4s ease;
    }

    .logo-text { 
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 2px;
      font-family: 'Inter', sans-serif;
      color: white;
      transition: color 0.4s ease;
    }
    
    .logo-accent { 
      font-weight: 300;
    }

    /* Desktop Nav */
    .main-nav {
      display: none;
      align-items: center;
      gap: 3rem;
      height: 100%;
    }

    @media (min-width: 992px) {
      .main-nav { display: flex; }
      .mobile-menu-btn { display: none; }
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-link:after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #ffa000;
      transition: width 0.3s ease;
    }

    .nav-link:hover:after,
    .nav-link.active:after {
      width: 100%;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #ffa000;
    }

    .dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      transition: transform 0.2s;
    }

    .nav-item-dropdown:hover .dropdown-icon {
      transform: rotate(180deg);
    }

    /* Mega Menu */
    .nav-item-dropdown {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .mega-menu {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: white;
      border-top: 1px solid #f0f0f0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      padding: 3rem 0;
      animation: slideDown 0.3s ease forwards;
      opacity: 0;
      transform: translateY(-10px);
    }
    
    .mega-menu h3 {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #1a237e;
      margin-bottom: 1.5rem;
    }

    @keyframes slideDown {
      to { opacity: 1; transform: translateY(0); }
    }

    .mega-menu-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4rem;
    }

    .menu-column a {
      display: block;
      color: #666;
      text-decoration: none;
      margin-bottom: 0.75rem;
      transition: color 0.2s;
      font-size: 0.95rem;
    }

    .menu-column a:hover {
      color: #ffa000;
      transform: translateX(5px);
    }

    .featured-card {
      background: #f5f5f5;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .featured-text {
      text-align: center;
      z-index: 1;
    }

    .btn-link {
      color: #1a237e;
      font-weight: 600;
      text-decoration: underline;
    }

    /* Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .action-btn {
      color: white;
      transition: all 0.2s;
    }

    .action-btn:hover {
      color: #ffa000;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .nav-link-small {
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: color 0.2s;
    }
    
    .nav-link-small:hover {
      color: #ffa000;
    }
    
    .btn-register {
      background: white;
      color: #1a237e;
      padding: 0.5rem 1.25rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.2s;
    }
    
    .btn-register:hover {
      background: #f0f0f0;
      transform: translateY(-1px);
    }
    
    .site-header.scrolled .btn-register {
      background: #000000;
      color: white;
    }
    
    .site-header.scrolled .btn-register:hover {
      background: #333333;
    }

    /* Mobile Menu */
    .mobile-menu-btn {
      display: block;
      margin-right: 1rem;
      color: white;
    }
    
    .site-header.scrolled .mobile-menu-btn {
      color: #333;
    }

    @media (min-width: 992px) {
      .mobile-menu-btn { display: none; }
    }

    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1001;
    }

    .mobile-menu-drawer {
      position: fixed;
      top: 0;
      left: -300px;
      width: 300px;
      height: 100%;
      background: white;
      z-index: 1002;
      transition: left 0.3s ease;
      box-shadow: 4px 0 20px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .mobile-menu-drawer.open {
      left: 0;
    }

    .drawer-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .logo-mobile .logo-text {
      color: #1a237e;
      font-size: 1.25rem;
    }

    .mobile-nav {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-nav a {
      font-size: 1rem;
      color: #333;
      text-decoration: none;
      font-weight: 600;
      padding: 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .divider {
      height: 1px;
      background: #f0f0f0;
      margin: 1rem 0;
    }
  `]
})
export class HeaderComponent {
  private router = inject(Router);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  
  cartCount$ = this.store.select(selectCartCount);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
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
