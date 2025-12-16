import type { Meta, StoryObj } from '@storybook/angular';
import { ProductsListComponent } from './products-list.component';
import { Product } from '../../../mocks/data';

const sampleProducts: Product[] = [
  {
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
    features: ['Feature 1']
  },
  {
    id: 2,
    name: 'Cahier A5',
    description: 'Premium A5 notebook',
    category: 'Stationery',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [{ user_id: 3, value: 5 }],
    rating: 5,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    features: ['Feature 1']
  },
  {
    id: 3,
    name: 'Classeur Rouge',
    description: 'Durable red binder',
    category: 'Office',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    owner_id: 12,
    ratings: [{ user_id: 4, value: 3 }],
    rating: 3,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    features: ['Feature 1']
  },
  {
    id: 4,
    name: 'Crayon HB',
    description: 'Standard HB pencil',
    category: 'Art',
    price: 1.2,
    created_at: '2025-03-01T08:45:00Z',
    owner_id: 13,
    ratings: [{ user_id: 2, value: 5 }],
    rating: 5,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80',
    features: ['Feature 1']
  },
  {
    id: 5,
    name: 'Règle 30cm',
    description: 'Clear plastic ruler',
    category: 'Stationery',
    price: 1.5,
    created_at: '2025-03-05T07:20:00Z',
    owner_id: 14,
    ratings: [{ user_id: 1, value: 4 }],
    rating: 4,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    features: ['Feature 1']
  },
];

const meta: Meta<ProductsListComponent> = {
  title: 'Shop/ProductsList',
  component: ProductsListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
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
    error: 'Failed to load products',
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

