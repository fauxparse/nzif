import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Input, { InputProps } from './Input';

import './Search.css';

type Story = StoryObj<typeof Input>;

const InputDemo = (args: InputProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ position: 'relative', width: 40, height: 40 }}>
      <Input {...args} expanded={expanded} onExpandedChange={setExpanded} />
    </div>
  );
};

export default {
  title: 'Molecules/Search/Input',
  component: Input,
  argTypes: {},
  args: {},
  render: (args) => <InputDemo {...args} />,
} satisfies Meta<typeof Input>;

export const Default: Story = {
  args: { left: -200, right: -100 },
  parameters: {
    layout: 'centered',
  },
};
