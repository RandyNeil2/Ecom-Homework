import { Meta, StoryObj } from '@storybook/angular';
import { PromoSummaryComponent } from './promo-summary.component';

const meta: Meta<PromoSummaryComponent> = {
  title: 'Shop/PromoSummary',
  component: PromoSummaryComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    subtotal: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Cart subtotal before discounts',
    },
    discount: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Discount amount applied',
    },
    code: {
      control: 'text',
      description: 'Promo code applied',
    },
  },
};

export default meta;
type Story = StoryObj<PromoSummaryComponent>;

export const NoDiscount: Story = {
  args: {
    subtotal: 100,
    discount: 0,
    code: '',
  },
};

export const Welcome10: Story = {
  args: {
    subtotal: 100,
    discount: 10,
    code: 'WELCOME10',
  },
};

export const VIP20: Story = {
  args: {
    subtotal: 150,
    discount: 30,
    code: 'VIP20',
  },
};

export const LargeDiscount: Story = {
  args: {
    subtotal: 500,
    discount: 100,
    code: 'SPECIAL20',
  },
};

export const SmallOrder: Story = {
  args: {
    subtotal: 25.50,
    discount: 2.55,
    code: 'WELCOME10',
  },
};
