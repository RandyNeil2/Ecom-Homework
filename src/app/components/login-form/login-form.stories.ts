import type { Meta, StoryObj } from '@storybook/angular';
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
  render: (args) => ({
    props: args,
    template: `
      <app-login-form (submit)="submit($event)"></app-login-form>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    // This story demonstrates the form with default empty fields
    // In a real scenario, you might want to prefill via component inputs
  },
};

