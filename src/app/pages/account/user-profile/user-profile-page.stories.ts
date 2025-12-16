import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UserProfilePageComponent } from './user-profile-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<UserProfilePageComponent> = {
  title: 'Account/UserProfilePage',
  component: UserProfilePageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<UserProfilePageComponent>;

export const Default: Story = {};
