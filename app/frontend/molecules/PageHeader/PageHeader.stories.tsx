import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import { PageHeader } from './PageHeader';

type Story = StoryObj<typeof PageHeader>;

export default {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  argTypes: {},
  args: {
    text: 'PageHeader',
  },
  render: (args) => <PageHeader {...args} />,
} satisfies Meta<typeof PageHeader>;

export const Default: Story = {
  args: {
    //
  },
};
