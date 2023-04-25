import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@/atoms/Button';

import { PopoverProps } from './Popover.types';
import Popover from '.';

type Story = StoryObj<typeof Popover>;

const PopoverDemo = (args: Omit<PopoverProps, 'reference' | 'open' | 'onOpenChange'>) => {
  const [reference, setReference] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button ref={setReference} text="Reference" onClick={() => setOpen(true)} />
      {reference && (
        <Popover reference={reference} open={open} onOpenChange={setOpen} {...args}>
          <Popover.Header>
            <h3 className="popover__title">Title</h3>
            <h4>Subtitle</h4>
            <Popover.Close />
          </Popover.Header>
        </Popover>
      )}
    </>
  );
};

export default {
  title: 'Molecules/Popover',
  component: Popover,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'centered',
  },
  render: (args) => <PopoverDemo {...args} />,
} satisfies Meta<typeof Popover>;

export const Default: Story = {
  args: {
    //
  },
};
