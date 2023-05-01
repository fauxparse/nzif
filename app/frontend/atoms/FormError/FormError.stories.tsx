import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FormError } from './FormError';

type Story = StoryObj<typeof FormError>;

export default {
  title: 'Atoms/FormError',
  component: FormError,
  argTypes: {},
  args: {},
  render: (args) => <FormError {...args} />,
} satisfies Meta<typeof FormError>;

export const Default: Story = {
  args: {
    errors: {
      name: { message: 'Name is required', type: 'too_small' },
    },
    field: 'name',
  },
};

export const NoError: Story = {
  args: {
    errors: {},
    field: 'name',
  },
};
