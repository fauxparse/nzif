import React from 'react';
import { randPhrase } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@/atoms/Button';

import Context from './Context';
import Toaster from '.';

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
