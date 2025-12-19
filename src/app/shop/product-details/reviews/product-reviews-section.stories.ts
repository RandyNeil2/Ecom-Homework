import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductReviewsSectionComponent } from './product-reviews-section.component';
import { reviewsReducer } from '../../../state/reviews/reviews.reducer';

const meta: Meta<ProductReviewsSectionComponent> = {
  title: 'Shop/ProductReviewsSection',
  component: ProductReviewsSectionComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ reviews: reviewsReducer }),
        provideAnimations()
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductReviewsSectionComponent>;

export const Default: Story = {
  args: {
    productId: 1,
  },
};

export const NoReviews: Story = {
  args: {
    productId: 999,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with no reviews yet.',
      },
    },
  },
};
