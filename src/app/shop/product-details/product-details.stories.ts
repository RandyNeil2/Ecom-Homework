import type { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsPageComponent } from './product-details-page.component';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { cartReducer } from '../../state/cart/cart.reducer';
import { Product } from '../../../mocks/data';

const sampleProduct: Product = {
  id: 1,
  name: 'Stylo Bleu',
  description: 'High quality blue pen',
  category: 'Stationery',
  price: 2.5,
  created_at: '2025-01-10T10:00:00Z',
  owner_id: 10,
  ratings: [{ user_id: 2, value: 4 }],
  rating: 4,
  stock: 10,
  image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
  features: ['Feature 1', 'Feature 2']
};

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/ProductDetails',
  component: ProductDetailsPageComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      ...story(),
      providers: [
        provideStore({ cart: cartReducer }),
        provideRouter([]),
        provideHttpClient(),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {
  args: {},
  parameters: {
    // Mock the route params and API response
    msw: {
      handlers: [],
    },
  },
};

export const HighRating: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [],
    },
  },
};

export const ExpensiveProduct: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [],
    },
  },
};

