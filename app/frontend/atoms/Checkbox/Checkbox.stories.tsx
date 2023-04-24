import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Icon from '../Icon';

import Checkbox from './Checkbox';
import { CheckboxProps } from './Checkbox.types';

type Story = StoryObj<typeof Checkbox>;

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      description: 'Whether the checkbox is checked',
      table: {
        type: {
          summary: 'boolean',
        },
      },
      control: 'boolean',
    },
    disabled: {
      description: 'Whether the checkbox is disabled',
      table: {
        type: {
          summary: 'boolean',
        },
      },
      control: 'boolean',
    },
    indeterminate: {
      description: 'Whether the checkbox is in an indeterminate state',
      table: {
        type: {
          summary: 'boolean',
        },
      },
      control: 'boolean',
    },
  },
  args: {},
  render: (args: CheckboxProps) => <Checkbox {...args} />,
} satisfies Meta<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const DisabledIndeterminate: Story = {
  args: { disabled: true, indeterminate: true },
};

export const Custom: Story = {
  args: {
    children: (
      <Icon>
        <rect x={3} y={3} width={18} height={18} rx={2} />
        <path d="M9 9l6 6l-3-3l3-3l-6 6" pathLength={1} />
      </Icon>
    ),
  },
};
