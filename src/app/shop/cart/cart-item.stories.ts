import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CartItemComponent } from './cart-item.component';
import { CartItem } from '../../state/cart/cart.actions';
import { Product } from '../../../mocks/data';

const sampleProduct: Product = {
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
  features: ['Smooth ink', 'Ergonomic grip']
};

const sampleCartItem: CartItem = {
  product: sampleProduct,
  quantity: 2,
};

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations()
      ],
    }),
  ],
  argTypes: {
    item: {
      control: 'object',
      description: 'Cart item with product and quantity',
    },
  },
};

export default meta;
type Story = StoryObj<CartItemComponent>;

export const Default: Story = {
  args: {
    item: sampleCartItem,
  },
};

export const SingleQuantity: Story = {
  args: {
    item: {
      product: sampleProduct,
      quantity: 1,
    },
  },
};

export const MultipleQuantity: Story = {
  args: {
    item: {
      product: {
        ...sampleProduct,
        id: 2,
        name: 'Cahier A5 Luxe',
        price: 3.9,
      },
      quantity: 5,
    },
  },
};

export const ExpensiveItem: Story = {
  args: {
    item: {
      product: {
        ...sampleProduct,
        id: 3,
        name: 'Palette Aquarelle Pro',
        price: 9.5,
      },
      quantity: 2,
    },
  },
};
