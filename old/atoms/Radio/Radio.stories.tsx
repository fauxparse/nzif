import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Radio from './Radio';
import { RadioProps } from './Radio.types';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Atoms/Radio',
  component: Radio,
  argTypes: {
    ref: {
      table: {
        disable: true,
      },
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {},
  render: (args: RadioProps) => <Radio {...args} />,
} satisfies Meta<typeof Radio>;

export const Default: Story = {
  args: {},
};
