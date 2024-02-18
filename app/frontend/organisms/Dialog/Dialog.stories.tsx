import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Button from '@/atoms/Button';

import Dialog from '.';

type Story = StoryObj<typeof Dialog>;

const DialogStory = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} text="Open" />
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Dialog title</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body />
        <Dialog.Footer />
      </Dialog>
    </>
  );
};

export default {
  title: 'Organisms/Dialog',
  component: Dialog,
  argTypes: {},
  args: {},
  parameters: { layout: 'centered' },
  render: () => <DialogStory />,
} satisfies Meta<typeof Dialog>;

export const Default: Story = {};
