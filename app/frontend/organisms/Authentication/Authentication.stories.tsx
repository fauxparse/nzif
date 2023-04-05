import type { Meta, StoryObj } from '@storybook/react';

import Authentication from '.';

const meta = {
  title: 'Organisms/Authentication',
  component: Authentication,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Authentication>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
};
