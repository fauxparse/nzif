import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateTime } from 'luxon';

import Countdown from '.';

type Story = StoryObj<typeof Countdown>;

export default {
  title: 'Atoms/Countdown',
  component: Countdown,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'centered',
  },
  render: (args) => <Countdown {...args} />,
} satisfies Meta<typeof Countdown>;

export const Default: Story = {
  args: {
    to: DateTime.fromISO('2023-10-07'),
  },
};
