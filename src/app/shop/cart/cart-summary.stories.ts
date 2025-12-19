import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CartSummaryComponent } from './cart-summary.component';

const meta: Meta<CartSummaryComponent> = {
  title: 'Shop/CartSummary',
  component: CartSummaryComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations()
      ],
    }),
  ],
  argTypes: {
    total: {
      control: { type: 'number', min: 0, step: 0.01 },
      description: 'Total cart amount',
    },
  },
};

export default meta;
type Story = StoryObj<CartSummaryComponent>;

export const Default: Story = {
  args: {
    total: 25.50,
  },
};

export const SmallTotal: Story = {
  args: {
    total: 5.20,
  },
};

export const LargeTotal: Story = {
  args: {
    total: 125.75,
  },
};

export const ZeroTotal: Story = {
  args: {
    total: 0,
  },
};
