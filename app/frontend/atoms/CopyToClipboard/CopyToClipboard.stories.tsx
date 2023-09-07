import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

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
