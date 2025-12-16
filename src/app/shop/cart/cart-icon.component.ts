import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { selectCartCount } from '../../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-cart-icon',
  imports: [CommonModule, RouterModule, MatIconModule, MatBadgeModule, MatButtonModule],
  template: `
    <button mat-icon-button [routerLink]="['/shop/cart']" aria-label="Shopping cart">
      <mat-icon>shopping_cart</mat-icon>
      <span
        matBadge="{{ cartCount$ | async }}"
        matBadgeOverlap="false"
        matBadgeColor="accent"
        *ngIf="(cartCount$ | async)! > 0"
      ></span>
    </button>
  `,
  styles: [
    `
      button {
        position: relative;
      }
    `,
  ],
})
export class CartIconComponent {
  private store = inject(Store);
  cartCount$ = this.store.select(selectCartCount);
}

