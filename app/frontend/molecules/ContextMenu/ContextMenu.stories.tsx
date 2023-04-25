import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Menu from '../Menu';

import ContextMenu from '.';

type Story = StoryObj<typeof ContextMenu>;

export default {
  title: 'Molecules/ContextMenu',
  component: ContextMenu,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div style={{ width: '100vw', height: '100vh' }}></div>
      </ContextMenu.Trigger>
      <ContextMenu>
        <Menu.Item label="Back" onClick={() => console.log('Back')} />
        <Menu.Item label="Forward" />
        <Menu.Item label="Reload" disabled />
        <Menu.Item label="Save As..." />
        <Menu.Item label="Print" />
      </ContextMenu>
    </ContextMenu.Root>
  ),
} satisfies Meta<typeof ContextMenu>;

export const Default: Story = {
  args: {
    //
  },
};
