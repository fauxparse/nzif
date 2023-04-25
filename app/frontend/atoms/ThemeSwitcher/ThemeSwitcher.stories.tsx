import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ThemeSwitcher from '.';

type Story = StoryObj<typeof ThemeSwitcher>;

export default {
  title: 'Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
  argTypes: {},
  args: {},
  render: (args) => <ThemeSwitcher {...args} />,
} satisfies Meta<typeof ThemeSwitcher>;

export const Default: Story = {
  args: {},
};
