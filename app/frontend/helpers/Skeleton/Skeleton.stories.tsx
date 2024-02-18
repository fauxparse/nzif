import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Skeleton from '.';

type Story = StoryObj<typeof Skeleton>;

export default {
  title: 'Helpers/Skeleton',
  component: Skeleton,
  argTypes: {},
  args: {},
  render: (args) => <Skeleton {...args} />,
} satisfies Meta<typeof Skeleton>;

export const Default: Story = {
  args: {
    //
  },
};
