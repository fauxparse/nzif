import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import CopyToClipboard from '.';

type Story = StoryObj<typeof CopyToClipboard>;

export default {
  title: 'Atoms/CopyToClipboard',
  component: CopyToClipboard,
  argTypes: {},
  args: {
    text: 'CopyToClipboard',
  },
  render: (args) => <CopyToClipboard {...args} />,
} satisfies Meta<typeof CopyToClipboard>;

export const Default: Story = {
  args: {
    //
  },
};
