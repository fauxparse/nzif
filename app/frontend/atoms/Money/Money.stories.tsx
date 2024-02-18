import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Money from '.';

type Story = StoryObj<typeof Money>;

export default {
  title: 'Atoms/Money',
  component: Money,
  argTypes: {},
  args: {
    text: 'Money',
  },
  render: (args) => <Money {...args} />,
} satisfies Meta<typeof Money>;

export const Default: Story = {
  args: {
    //
  },
};
