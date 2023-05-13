import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import InPlaceEdit from '.';

type Story = StoryObj<typeof InPlaceEdit>;

const InPlaceEditDemo = () => {
  const [value, setValue] = useState('');
  return <InPlaceEdit as="input" value={value} placeholder="Edit me…" onChange={setValue} />;
};

export default {
  title: 'Molecules/InPlaceEdit',
  component: InPlaceEdit,
  argTypes: {},
  args: {},
  render: () => <InPlaceEditDemo />,
} satisfies Meta<typeof InPlaceEdit>;

export const Default: Story = {};
