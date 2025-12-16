import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-shop-footer',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  styles: [`
    :host {
      display: block;
      background-color: #1a1a1a;
      color: #ffffff;
      padding-top: 64px;
      padding-bottom: 32px;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 48px;
    }
    h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      margin-bottom: 24px;
      color: #ffffff;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      margin-bottom: 12px;
    }
    a {
      color: #a0a0a0;
      text-decoration: none;
      transition: color 0.2s;
    }
    a:hover {
      color: #ffffff;
    }
    .newsletter-form {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .social-links {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }
    .copyright {
      text-align: center;
      margin-top: 64px;
      padding-top: 32px;
      border-top: 1px solid #333;
      color: #666;
      font-size: 0.875rem;
    }
    /* Removed dark background overrides to allow global white style */
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `],
  template: `
    <div class="footer-container">
      <!-- Brand -->
      <div>
        <h3>Luxe Shop</h3>
        <p style="color: #a0a0a0; line-height: 1.6;">
          Experience the finest collection of premium products. 
          Curated for quality, designed for elegance.
        </p>
        <div class="social-links">
          <a mat-icon-button><mat-icon>facebook</mat-icon></a>
          <a mat-icon-button><mat-icon>camera_alt</mat-icon></a> <!-- Instagram -->
          <a mat-icon-button><mat-icon>alternate_email</mat-icon></a> <!-- Twitter -->
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3>Shop</h3>
        <ul>
          <li><a routerLink="/products">All Products</a></li>
          <li><a routerLink="/products/new">New Arrivals</a></li>
          <li><a routerLink="/products/featured">Featured</a></li>
          <li><a routerLink="/products/sale">Sale</a></li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h3>Support</h3>
        <ul>
          <li><a routerLink="/faq">FAQ</a></li>
          <li><a routerLink="/shipping">Shipping & Returns</a></li>
          <li><a routerLink="/contact">Contact Us</a></li>
          <li><a routerLink="/privacy">Privacy Policy</a></li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h3>Newsletter</h3>
        <p style="color: #a0a0a0; margin-bottom: 16px;">Subscribe to receive updates, access to exclusive deals, and more.</p>
        <div class="newsletter-form">
          <mat-form-field appearance="fill" style="width: 100%;" density="compact">
            <input matInput placeholder="Enter your email">
          </mat-form-field>
          <button mat-flat-button color="accent" style="height: 40px;">Subscribe</button>
        </div>
      </div>
    </div>

    <div class="copyright">
      &copy; 2025 Luxe Shop. All rights reserved.
    </div>
  `
})
export class ShopFooterComponent {}
