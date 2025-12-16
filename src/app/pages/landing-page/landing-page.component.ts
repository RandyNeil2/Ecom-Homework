import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { selectProductsList } from '../../state/products/products.selectors';
import { selectIsLoggedIn, selectAuthLoading } from '../../state/auth/auth.selectors';
import { Product } from '../../../mocks/data';
import * as ProductsActions from '../../state/products/products.actions';
import * as AuthActions from '../../state/auth/auth.actions';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProductsListComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  featuredProducts$ = this.store.select(selectProductsList);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  loading$ = this.store.select(selectAuthLoading);
  
  showLoginForm = false;
  loginForm: FormGroup = this.fb.group({
    email: ['demo@example.com', [Validators.required, Validators.email]],
    password: ['demo123456', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    // Load first 6 products for featured section
    this.store.dispatch(
      ProductsActions.loadProducts({ params: { page: 1, pageSize: 6, ordering: '-created_at' } })
    );
  }

  categories = [
    { 
      id: 1, 
      name: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Latest Gadgets'
    },
    { 
      id: 2, 
      name: 'Fashion', 
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Trending Styles'
    },
    { 
      id: 3, 
      name: 'Home & Living', 
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Modern Decor'
    },
    { 
      id: 4, 
      name: 'Accessories', 
      image: 'https://images.unsplash.com/photo-1523293188086-b589b9b145e8?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Essential Details'
    },
  ];

  advantages = [
    { icon: 'local_shipping', title: 'Fast Delivery', description: 'Free shipping on orders over $50' },
    { icon: 'support_agent', title: '24/7 Support', description: 'We\'re here to help anytime' },
    { icon: 'lock', title: 'Secure Payment', description: 'Your data is safe with us' },
    { icon: 'autorenew', title: 'Easy Returns', description: '30-day return policy' },
  ];

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ username: email, password }));
      
      // Handle success
      this.store.select(selectIsLoggedIn).pipe(take(2)).subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.snackBar.open('Welcome back!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.showLoginForm = false;
        }
      });
    }
  }
}

