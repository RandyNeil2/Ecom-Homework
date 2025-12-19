import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { OrderDetailsPageComponent } from './order-details-page.component';
import { ordersReducer } from '../../../state/orders/orders.reducer';

const meta: Meta<OrderDetailsPageComponent> = {
  title: 'Account/OrderDetailsPage',
  component: OrderDetailsPageComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ orders: ordersReducer }),
        provideRouter([]),
        provideAnimations()
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<OrderDetailsPageComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Order details page showing full order breakdown including items, shipping address, and price summary.',
      },
    },
  },
};

export const NotFound: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Order not found state when navigating to an invalid order ID.',
      },
    },
  },
};
