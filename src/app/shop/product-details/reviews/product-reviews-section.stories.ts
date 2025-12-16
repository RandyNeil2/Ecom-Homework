import { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { ProductReviewsSectionComponent } from './product-reviews-section.component';
import { reviewsReducer } from '../../../state/reviews/reviews.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<ProductReviewsSectionComponent> = {
  title: 'Shop/ProductReviewsSection',
  component: ProductReviewsSectionComponent,
  tags: ['autodocs'],
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
