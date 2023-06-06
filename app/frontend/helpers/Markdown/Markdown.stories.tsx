import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import Markdown from '.';

type Story = StoryObj<typeof Markdown>;

export default {
  title: 'Helpers/Markdown',
  component: Markdown,
  argTypes: {},
  args: {
    text: 'Markdown',
  },
  render: (args) => <Markdown {...args} />,
} satisfies Meta<typeof Markdown>;

export const Default: Story = {
  args: {
    //
  },
};
