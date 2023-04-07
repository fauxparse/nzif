import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from './Footer';

type Story = StoryObj<typeof Footer>;

export default {
  title: 'Organisms/Footer',
  component: Footer,
  argTypes: {},
  render: (args) => <Footer {...args} />,
} satisfies Meta<typeof Footer>;

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
};
