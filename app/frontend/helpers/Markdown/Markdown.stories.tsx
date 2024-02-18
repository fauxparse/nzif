import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Markdown from '.';

type Story = StoryObj<typeof Markdown>;

export default {
  title: 'Helpers/Markdown',
  component: Markdown,
  argTypes: {},
  args: {
    children: 'Markdown',
  },
  render: (args) => <Markdown {...args} />,
} satisfies Meta<typeof Markdown>;

export const Default: Story = {
  args: {
    //
  },
};
