import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Menu from '.';

type Story = StoryObj<typeof Menu>;

export default {
  title: 'Molecules/Menu',
  component: Menu,
  argTypes: {},
  args: {
    text: 'Menu',
  },
  render: (args) => <Menu {...args} />,
} satisfies Meta<typeof Menu>;

export const Default: Story = {
  args: {
    //
  },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item icon="check" label="Menu item" />
      <Menu.Separator />
      <Menu.Item disabled label="Disabled" />
    </Menu>
  ),
};
