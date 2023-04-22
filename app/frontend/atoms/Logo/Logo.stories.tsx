import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import { Logo } from './Logo';

type Story = StoryObj<typeof Logo>;

export default {
  title: 'Atoms/Logo',
  component: Logo,
  argTypes: {},
  args: {
    text: 'Logo',
  },
  render: (args) => <Logo {...args} />,
} satisfies Meta<typeof Logo>;

export const Default: Story = {
  args: {
    //
  },
};
