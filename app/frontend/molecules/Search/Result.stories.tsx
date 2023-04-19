import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Result from './Result';

import './Search.css';

type Story = StoryObj<typeof Result>;

export default {
  title: 'Molecules/Search/Result',
  component: Result,
  argTypes: {},
  args: {
    loading: false,
    active: false,
  },
  render: (args) => <Result {...args} style={{ minWidth: '24rem' }} />,
} satisfies Meta<typeof Result>;

export const Default: Story = {
  args: {
    title: 'Code of conduct',
    description: 'Your rights and responsibilities as an NZIF participant',
  },
  parameters: {
    layout: 'centered',
  },
};
