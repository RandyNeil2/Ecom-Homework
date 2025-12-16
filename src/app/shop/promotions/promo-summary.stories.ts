import { Meta, StoryObj } from '@storybook/angular';
import { PromoSummaryComponent } from './promo-summary.component';

const meta: Meta<PromoSummaryComponent> = {
  title: 'Shop/PromoSummary',
  component: PromoSummaryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PromoSummaryComponent>;

export const Default: Story = {
  args: {
    subtotal: 100,
    discount: 0,
    tax: 20,
    total: 120,
  },
};

export const WithDiscount: Story = {
  args: {
    subtotal: 100,
    discount: 20,
    tax: 16, // (100-20) * 0.2
    total: 96,
  },
};
