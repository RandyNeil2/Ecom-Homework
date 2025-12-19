import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OrdersListPageComponent } from './orders-list-page.component';
import { ordersReducer } from '../../../state/orders/orders.reducer';

const meta: Meta<OrdersListPageComponent> = {
  title: 'Account/OrdersListPage',
  component: OrdersListPageComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ orders: ordersReducer }),
        provideAnimations()
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<OrdersListPageComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Orders list with search and status filter functionality.',
      },
    },
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no orders exist.',
      },
    },
  },
};
