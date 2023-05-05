import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AvatarSize } from './Avatar.types';
import Avatar from '.';

type Story = StoryObj<typeof Avatar>;

export default {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      table: {
        type: {
          summary: 'AvatarSize',
        },
        defaultValue: {
          summary: 'SMALL',
        },
      },
      options: Object.values(AvatarSize),
      control: {
        type: 'radio',
      },
    },
  },
  args: {},
  render: (args) => <Avatar {...args} />,
} satisfies Meta<typeof Avatar>;

export const Default: Story = {
  args: {},
};

export const Initials: Story = {
  args: {
    name: 'Lauren Ipsum',
  },
};

export const Image: Story = {
  args: {
    name: 'Lauren Ipsum',
    url: 'https://doodleipsum.com/128x128/avatar',
  },
};
