import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCardComponent } from './product-card.component';

const meta: Meta<ProductCardComponent> = {
  title: 'Shop/ProductCard',
  component: ProductCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Product name',
    },
    price: {
      control: { type: 'number', min: 0, step: 0.1 },
      description: 'Product price in euros',
    },
    created_at: {
      control: 'text',
      description: 'Creation date (ISO string)',
    },
    avgRating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Average rating (0-5)',
    },
  },
};

export default meta;
type Story = StoryObj<ProductCardComponent>;

export const Default: Story = {
  args: {
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    avgRating: 4.0,
  },
};

export const HighRating: Story = {
  args: {
    name: 'Cahier A5',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    avgRating: 5.0,
  },
};

export const LowRating: Story = {
  args: {
    name: 'Classeur Rouge',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    avgRating: 2.5,
  },
};

export const Expensive: Story = {
  args: {
    name: 'Palette Aquarelle',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    avgRating: 4.8,
  },
};

