import React, { useState } from 'react';
import { FloatingDelayGroup } from '@floating-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '../../atoms/Button';

import { Tooltip } from './Tooltip';

type Story = StoryObj<typeof Tooltip>;

export default {
  title: 'Helpers/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    trigger: {
      control: 'check',
      options: ['click', 'hover', 'focus', 'manual'],
    },
    ref: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    placement: 'top',
    trigger: ['hover', 'focus', 'manual'],
    content: (
      <>
        This content is <b>inside</b> the tooltip
      </>
    ),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>;

export const Default: Story = {
  args: {
    children: <Button text="Hover me" />,
  },
};

export const Click: Story = {
  args: {
    trigger: 'click',
    children: <Button text="Click me" />,
  },
};

export const Group: Story = {
  render: (args) => (
    <FloatingDelayGroup delay={{ open: 500, close: 500 }}>
      <div style={{ display: 'flex', gap: 'var(--small)' }}>
        <Tooltip {...args}>
          <Button text="First" />
        </Tooltip>
        <Tooltip {...args}>
          <Button text="Second" />
        </Tooltip>
        <Tooltip {...args}>
          <Button text="Third" />
        </Tooltip>
      </div>
    </FloatingDelayGroup>
  ),
};

export const Wordy: Story = {
  args: {
    ...Default.args,
    content: (
      <>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae nisl nec nunc</>
    ),
  },
};

export const Manual: Story = {
  args: {
    content: 'Hello',
    trigger: 'manual',
  },
  render: function Manual(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: 'flex', gap: 'var(--small)' }}>
        <Tooltip open={isOpen} {...args} trigger="manual">
          <Button primary text="Reference" />
        </Tooltip>
        <Button text="Toggle" onClick={() => setIsOpen((prev) => !prev)} />
      </div>
    );
  },
};
