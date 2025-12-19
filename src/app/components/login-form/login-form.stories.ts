import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './login-form.component';

const meta: Meta<LoginFormComponent> = {
  title: 'Shop/LoginForm',
  component: LoginFormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['submit'],
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations()
      ],
    }),
  ],
  argTypes: {
    submit: {
      action: 'submit',
      description: 'Emitted when form is submitted with username and password',
    },
  },
};

export default meta;
type Story = StoryObj<LoginFormComponent>;

export const Default: Story = {};

export const WithPrefilledValues: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Login form with username and password fields.',
      },
    },
  },
};
