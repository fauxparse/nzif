import React from 'react';
import { randFullName, randJobTitle, randUrl } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';
import { range } from 'lodash-es';

import Results from './Results';

import './Search.css';

type Story = StoryObj<typeof Results>;

export default {
  title: 'Molecules/Search/Results',
  component: Results,
  argTypes: {},
  args: {
    loading: false,
    style: {
      minWidth: '24rem',
    },
  },
  render: (args) => <Results {...args} style={{ minWidth: '24rem' }} />,
} satisfies Meta<typeof Results>;

export const Default: Story = {
  args: {
    results: range(5).map((i) => ({
      id: String(i),
      title: randFullName(),
      description: randJobTitle(),
      url: randUrl(),
    })),
    loading: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export const NoResults: Story = {
  args: {
    results: [],
    loading: true,
  },
  parameters: {
    layout: 'centered',
  },
};
