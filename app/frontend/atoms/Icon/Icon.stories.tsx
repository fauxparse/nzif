import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Icon, { IconProps } from '.';
import ICONS, { IconName } from './icons';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      options: Object.keys(ICONS),
      control: 'select',
    },
  },
  render: (args: IconProps) => <Icon {...args} />,
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'user',
  },
};

export const All: Story = {
  args: { name: 'user' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 1.5rem)', gap: '1rem' }}>
      {(Object.keys(ICONS) as IconName[]).map((name) => (
        <Icon key={name} name={name} />
      ))}
    </div>
  ),
};
