import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { selectWishlistItems } from '../../state/wishlist/wishlist.selectors';
import { loadWishlist, removeFromWishlist } from '../../state/wishlist/wishlist.actions';
import { Product } from '../../../mocks/data';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="wishlist-page">
      <h1>My Wishlist</h1>
      
      <div class="wishlist-grid" *ngIf="items$ | async as items">
        <div *ngIf="items.length === 0" class="empty-state">
          <mat-icon>favorite_border</mat-icon>
          <p>Your wishlist is empty.</p>
          <button mat-raised-button color="primary" routerLink="/shop/products">Start Shopping</button>
        </div>

        <mat-card *ngFor="let item of items" class="product-card">
          <!-- <img mat-card-image [src]="item.image" [alt]="item.name"> -->
          <mat-card-content>
            <h3>{{item.name}}</h3>
            <p class="price">{{item.price | currency:'EUR'}}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/shop/products', item.id]">View</button>
            <button mat-icon-button color="warn" (click)="remove(item.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      color: #ccc;
    }
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .product-card mat-card-content {
      flex-grow: 1;
    }
    img {
      height: 200px;
      object-fit: cover;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistPageComponent implements OnInit {
  private store = inject(Store);
  items$ = this.store.select(selectWishlistItems);

  ngOnInit() {
    this.store.dispatch(loadWishlist());
  }

  remove(productId: number) {
    this.store.dispatch(removeFromWishlist({ productId }));
  }
}
