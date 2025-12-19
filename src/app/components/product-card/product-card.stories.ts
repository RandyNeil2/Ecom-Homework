import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductCardComponent } from './product-card.component';
import { wishlistReducer } from '../../state/wishlist/wishlist.reducer';
import { cartReducer } from '../../state/cart/cart.reducer';

const meta: Meta<ProductCardComponent> = {
  title: 'Shop/ProductCard',
  component: ProductCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
    id: {
      control: 'number',
      description: 'Product ID',
    },
    name: {
      control: 'text',
      description: 'Product name',
    },
    price: {
      control: { type: 'number', min: 0, step: 0.1 },
      description: 'Product price in euros',
    },
    stock: {
      control: { type: 'number', min: 0 },
      description: 'Available stock quantity',
    },
    lowStockThreshold: {
      control: { type: 'number', min: 1 },
      description: 'Threshold below which "low stock" warning appears',
    },
    avgRating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Average rating (0-5)',
    },
    category: {
      control: 'text',
      description: 'Product category',
    },
  },
};

export default meta;
type Story = StoryObj<ProductCardComponent>;

export const Default: Story = {
  args: {
    id: 1,
    name: 'Stylo Bleu Premium',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    avgRating: 4.0,
    stock: 50,
    lowStockThreshold: 10,
    category: 'Stationery',
  },
};

export const InStock: Story = {
  args: {
    id: 2,
    name: 'Cahier A5 Luxe',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    avgRating: 5.0,
    stock: 100,
    lowStockThreshold: 10,
    category: 'Stationery',
  },
};

export const LowStock: Story = {
  args: {
    id: 3,
    name: 'Palette Aquarelle Pro',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    avgRating: 4.8,
    stock: 5,
    lowStockThreshold: 10,
    category: 'Art',
  },
};

export const OutOfStock: Story = {
  args: {
    id: 4,
    name: 'Tampon Encreur Date',
    price: 5.0,
    created_at: '2025-02-12T12:00:00Z',
    avgRating: 4.0,
    stock: 0,
    lowStockThreshold: 10,
    category: 'Office',
  },
};

export const HighRating: Story = {
  args: {
    id: 5,
    name: 'Classeur Premium',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    avgRating: 5.0,
    stock: 25,
    lowStockThreshold: 5,
    category: 'Office',
  },
};

export const LowRating: Story = {
  args: {
    id: 6,
    name: 'Basic Notebook',
    price: 1.99,
    created_at: '2025-03-01T09:00:00Z',
    avgRating: 2.5,
    stock: 80,
    lowStockThreshold: 10,
    category: 'Stationery',
  },
};
