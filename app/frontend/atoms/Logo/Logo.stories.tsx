import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Logo } from './Logo';

type Story = StoryObj<typeof Logo>;

export default {
  title: 'Atoms/Logo',
  component: Logo,
  argTypes: {},
  args: {},
  render: (args) => <Logo {...args} />,
} satisfies Meta<typeof Logo>;

export const Default: Story = {
  args: {
    //
  },
};
