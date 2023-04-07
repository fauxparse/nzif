import type { Meta, StoryObj } from '@storybook/react';

import { User } from './AuthenticationMachine';
import Authentication from '.';

const meta = {
  title: 'Organisms/Authentication',
  component: Authentication,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Authentication>;

export default meta;

type Story = StoryObj<typeof meta>;

const user: User = {
  id: '1',
  name: 'Lauren Ipsum',
  email: 'lauren@example.com',
};

export const Primary: Story = {
  args: {
    user: null,
    onLogIn: () => Promise.resolve({ user }),
    onSignUp: () => Promise.resolve({ user }),
    onLogOut: () => Promise.resolve(true),
    onResetPassword: () => Promise.resolve(true),
  },
  parameters: {
    layout: 'fullscreen',
  },
};
