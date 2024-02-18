import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Spinner } from './Spinner';

type Story = StoryObj<typeof Spinner>;

export default {
  title: 'Atoms/Spinner',
  component: Spinner,
  argTypes: {},
  args: {},
  render: (args) => <Spinner {...args} />,
} satisfies Meta<typeof Spinner>;

export const Default: Story = {
  args: {
    //
  },
  parameters: {
    layout: 'centered',
  },
};
