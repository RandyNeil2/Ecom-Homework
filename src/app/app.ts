import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './components/layout/header.component';
import { ShopFooterComponent } from './shop/shared/shop-footer.component';
import * as CartActions from './state/cart/cart.actions';
import * as OrdersActions from './state/orders/orders.actions';
import * as AuthActions from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ShopFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('my-shop');
  private store = inject(Store);
  private router = inject(Router);
  
  isHomePage = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url.split('?')[0];
      this.isHomePage.set(url === '/' || url === '/home');
    });
  }

  ngOnInit() {
    // Load cart from localStorage on app initialization
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        this.store.dispatch(CartActions.loadCartFromStorage({ items }));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }

    // Load orders from localStorage on app initialization
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        this.store.dispatch(OrdersActions.loadOrdersFromStorage({ orders }));
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }

    // Load auth from localStorage
    this.store.dispatch(AuthActions.loadAuthFromStorage());
  }
}

