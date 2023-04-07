import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Placename } from './Placename';

type Story = StoryObj<typeof Placename>;

export default {
  title: 'Atoms/Placename',
  component: Placename,
  argTypes: {},
  args: {
    name: 'Wellington',
    indigenousName: 'Te Whanganui-a-Tara',
    showIndigenousNameByDefault: true,
  },
  render: (args) => <Placename {...args} />,
} satisfies Meta<typeof Placename>;

export const Default: Story = {};
