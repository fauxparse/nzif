import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import Callout from '.';

type Story = StoryObj<typeof Callout>;

export default {
  title: 'Molecules/Callout',
  component: Callout,
  argTypes: {},
  args: {
    text: 'Callout',
  },
  render: (args) => <Callout {...args} />,
} satisfies Meta<typeof Callout>;

export const Default: Story = {
  args: {
    //
  },
};
