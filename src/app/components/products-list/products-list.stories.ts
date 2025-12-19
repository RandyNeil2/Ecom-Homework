import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductsListComponent } from './products-list.component';
import { wishlistReducer } from '../../state/wishlist/wishlist.reducer';
import { cartReducer } from '../../state/cart/cart.reducer';
import { Product } from '../../../mocks/data';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Stylo Bleu Premium',
    description: 'High quality blue pen for smooth writing',
    category: 'Stationery',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 2, value: 4 }],
    rating: 4,
    stock: 50,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
    features: ['Smooth ink', 'Ergonomic']
  },
  {
    id: 2,
    name: 'Cahier A5 Luxe',
    description: 'Premium A5 notebook with lined pages',
    category: 'Stationery',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [{ user_id: 3, value: 5 }],
    rating: 5,
    stock: 100,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    features: ['100gsm paper', 'Hardcover']
  },
  {
    id: 3,
    name: 'Palette Aquarelle Pro',
    description: 'Professional watercolor palette',
    category: 'Art',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    owner_id: 12,
    ratings: [{ user_id: 4, value: 5 }],
    rating: 5,
    stock: 5,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    features: ['12 colors', 'Professional grade']
  },
];

const meta: Meta<ProductsListComponent> = {
  title: 'Shop/ProductsList',
  component: ProductsListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ wishlist: wishlistReducer, cart: cartReducer }),
        provideRouter([]),
        provideAnimations()
      ],
    }),
  ],
  argTypes: {
    products: {
      control: 'object',
      description: 'Array of products to display',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    error: {
      control: 'text',
      description: 'Error message (null if no error)',
    },
  },
};

export default meta;
type Story = StoryObj<ProductsListComponent>;

export const Default: Story = {
  args: {
    products: sampleProducts,
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
    error: null,
  },
};

export const Error: Story = {
  args: {
    products: [],
    loading: false,
    error: 'Failed to load products. Please try again.',
  },
};

export const Empty: Story = {
  args: {
    products: [],
    loading: false,
    error: null,
  },
};

export const SingleProduct: Story = {
  args: {
    products: [sampleProducts[0]],
    loading: false,
    error: null,
  },
};
