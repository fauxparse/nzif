import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Labelled from '.';

type Story = StoryObj<typeof Labelled>;

export default {
  title: 'Helpers/Labelled',
  component: Labelled,
  argTypes: {},
  args: {},
  render: (args) => <Labelled {...args} />,
} satisfies Meta<typeof Labelled>;

export const Default: Story = {
  args: {
    //
  },
};
