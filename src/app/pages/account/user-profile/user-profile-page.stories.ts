import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { UserProfilePageComponent } from './user-profile-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { userReducer } from '../../../state/user/user.reducer';

const meta: Meta<UserProfilePageComponent> = {
  title: 'Account/UserProfilePage',
  component: UserProfilePageComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
    applicationConfig({
      providers: [
        provideStore({ user: userReducer })
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<UserProfilePageComponent>;

export const Default: Story = {};

export const WithData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Profile page with form fields for editing user information and preferences.',
      },
    },
  },
};
