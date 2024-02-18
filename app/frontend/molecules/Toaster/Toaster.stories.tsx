import { randPhrase } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Button from '@/atoms/Button';

import Toaster from '.';
import Context from './Context';

type Story = StoryObj<typeof Toaster>;

const NotifyButton = () => {
  const { notify } = React.useContext(Context);
  return <Button text="Notify" onClick={() => notify(randPhrase())} />;
};

export default {
  title: 'Molecules/Toaster',
  component: Toaster,
  argTypes: {},
  args: {},
  parameters: { layout: 'centered' },
  render: (args) => (
    <Toaster {...args}>
      <NotifyButton />
    </Toaster>
  ),
} satisfies Meta<typeof Toaster>;

export const Default: Story = {
  args: {
    //
  },
};
