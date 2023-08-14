import type { Meta, StoryObj } from '@storybook/react';

import ProgressBar from '.';

type Story = StoryObj<typeof ProgressBar>;

export default {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  argTypes: {},
  args: {
    max: 100,
    value: 50,
  },
  render: (args) => <ProgressBar {...args} />,
} satisfies Meta<typeof ProgressBar>;

export const Default: Story = {
  args: {
    //
  },
};
