import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Menu from '.';

type Story = StoryObj<typeof Menu.Item>;

export default {
  title: 'Molecules/Menu/Item',
  component: Menu.Item,
  argTypes: {},
  args: {},
  render: (args) => <Menu.Item {...args} />,
} satisfies Meta<typeof Menu.Item>;

export const Default: Story = {
  args: {
    label: 'Menu item',
  },
};

export const Checked: Story = {
  args: {
    icon: 'check',
    label: 'Menu item',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Menu item',
    disabled: true,
  },
};
