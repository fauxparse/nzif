import type { Meta, StoryObj } from '@storybook/react';

import Icon from '@/atoms/Icon';
import Input from '@/atoms/Input';

import AutoResize from './AutoResize';

type Story = StoryObj<typeof AutoResize>;

export default {
  title: 'Helpers/AutoResize',
  component: AutoResize,
  argTypes: {},
} satisfies Meta<typeof AutoResize>;

export const Default: Story = {
  args: {
    children: <Input placeholder="I auto-resize" />,
  },
};

export const Textarea: Story = {
  args: {
    children: <Input as="textarea" placeholder="I auto-resize" />,
  },
};

export const Flexbox: Story = {
  args: {},
  render: () => (
    <div
      style={{
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        width: '25rem',
        height: 'max-content',
        maxWidth: '100vw',
        background: 'var(--panel)',
      }}
    >
      <Icon>
        <path d="M5 12H19M19 12L12 5M19 12L12 19" />
      </Icon>
      <AutoResize>
        <Input htmlSize={1} />
      </AutoResize>
      <Icon>
        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
      </Icon>
    </div>
  ),
};
