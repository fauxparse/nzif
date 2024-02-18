import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Placename from '.';

type Story = StoryObj<typeof Placename>;

export default {
  title: 'Atoms/Placename',
  component: Placename,
  argTypes: {},
  args: {
    name: 'Wellington',
    traditionalName: 'Te Whanganui-a-Tara',
    showTraditionalNameByDefault: true,
  },
  render: (args) => <Placename {...args} />,
} satisfies Meta<typeof Placename>;

export const Default: Story = {};
