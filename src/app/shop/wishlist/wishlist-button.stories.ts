import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { WishlistButtonComponent } from './wishlist-button.component';
import { wishlistReducer } from '../../state/wishlist/wishlist.reducer';

const meta: Meta<WishlistButtonComponent> = {
  title: 'Shop/WishlistButton',
  component: WishlistButtonComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ wishlist: wishlistReducer })
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<WishlistButtonComponent>;

export const Default: Story = {
  args: {
    product: {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 100,
      created_at: new Date().toISOString(),
      owner_id: 1,
      ratings: [{ user_id: 1, value: 4.5 }],
      rating: 4.5,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80',
      features: ['Feature 1', 'Feature 2']
    },
  },
};
