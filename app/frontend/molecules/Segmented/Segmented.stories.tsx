import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SegmentedOption } from './Segmented.types';
import Segmented from '.';

type Story = StoryObj<typeof Segmented>;

type Ink = 'cyan' | 'magenta' | 'yellow';

const options: SegmentedOption<Ink>[] = [
  { id: 'cyan', label: 'Cyan' },
  { id: 'magenta', label: 'Magenta' },
  { id: 'yellow', label: 'Yellow' },
];

const ExclusiveExample = () => {
  const [value, setValue] = React.useState<Ink>('cyan');
  return <Segmented exclusive options={options} value={value} onChange={setValue} />;
};

const MultipleExample = () => {
  const [value, setValue] = React.useState<Ink[]>([]);
  return <Segmented options={options} value={value} onChange={setValue} />;
};

export default {
  title: 'Molecules/Segmented',
  component: Segmented,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Segmented>;

export const Exclusive: Story = {
  render: () => <ExclusiveExample />,
};

export const Multiple: Story = {
  render: () => <MultipleExample />,
};
