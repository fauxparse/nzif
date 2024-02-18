import type { Meta, StoryObj } from '@storybook/react';

import Authentication from '.';
import { User } from './AuthenticationMachine';

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
  email: 'lauren@example.com',
  profile: {
    name: 'Lauren Ipsum',
  },
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
