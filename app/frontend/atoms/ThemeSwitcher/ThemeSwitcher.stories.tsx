import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeSwitcherProps } from './ThemeSwitcher.types';

type Story = StoryObj<typeof ThemeSwitcher>;

export default {
  title: 'Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
  argTypes: {},
  args: {
    text: 'ThemeSwitcher',
  },
  render: (args) => <ThemeSwitcher {...args} />,
} satisfies Meta<typeof ThemeSwitcher>;

export const Default: Story = {
  args: {
    //
  },
};
