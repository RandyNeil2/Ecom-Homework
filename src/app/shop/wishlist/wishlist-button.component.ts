import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Product } from '../../../mocks/data';
import { addToWishlist, removeFromWishlist, toggleWishlist } from '../../state/wishlist/wishlist.actions';
import { selectIsWishlisted } from '../../state/wishlist/wishlist.selectors';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button (click)="toggle($event)" [color]="(isWishlisted$ | async) ? 'warn' : ''"
      [attr.aria-label]="(isWishlisted$ | async) ? 'Remove from wishlist' : 'Add to wishlist'">
      <mat-icon>{{ (isWishlisted$ | async) ? 'favorite' : 'favorite_border' }}</mat-icon>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistButtonComponent {
  @Input({ required: true }) product!: Product;

  private store = inject(Store);
  
  // We need to know the product ID to select the state.
  // Since input binding happens after construction, we might need a signal or a getter.
  // But for async pipe, we can use a method or assign in ngOnInit.
  // However, Inputs are not available in constructor.
  // Let's use a getter for the observable or just a simple method in template?
  // No, async pipe needs an observable.
  // Best way with OnPush and Inputs is to use ngOnChanges or a signal.
  // Let's use a simple approach: a function that returns the observable is not efficient in template.
  // We'll use a property that we update in ngOnChanges.
  
  isWishlisted$ = this.store.select(selectIsWishlisted(0)); // Initial dummy

  ngOnChanges() {
    if (this.product) {
      this.isWishlisted$ = this.store.select(selectIsWishlisted(this.product.id));
    }
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.store.dispatch(toggleWishlist({ product: this.product }));
  }
}
