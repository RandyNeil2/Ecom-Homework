import { Meta, StoryObj } from '@storybook/angular';
import { AdminStatsCardComponent } from './admin-stats-card.component';

const meta: Meta<AdminStatsCardComponent> = {
  title: 'Admin/StatsCard',
  component: AdminStatsCardComponent,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
    },
  },
};

export default meta;
type Story = StoryObj<AdminStatsCardComponent>;

export const Primary: Story = {
  args: {
    title: 'Total Revenue',
    value: '$54,239',
    icon: 'attach_money',
    color: 'primary',
    trend: 12,
  },
};

export const Accent: Story = {
  args: {
    title: 'Total Orders',
    value: '1,253',
    icon: 'shopping_bag',
    color: 'accent',
    trend: 8,
  },
};

export const NegativeTrend: Story = {
  args: {
    title: 'Active Users',
    value: '892',
    icon: 'people',
    color: 'warn',
    trend: -3,
  },
};
