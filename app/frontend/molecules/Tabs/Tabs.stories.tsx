import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import Tabs from './Tabs';

type Story = StoryObj<typeof Tabs>;

const TabsDemo: React.FC<{ tabs: string[] }> = ({ tabs }) => {
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <>
      {tabs.map((tab) => (
        <Tabs.Tab
          key={tab}
          text={tab}
          selected={selected === tab}
          onClick={() => setSelected(tab)}
        />
      ))}
    </>
  );
};

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
  argTypes: {},
  args: {
    text: 'Tabs',
    tabs: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'],
  },
  render: ({ tabs, ...args }) => (
    <Tabs {...args}>
      <TabsDemo tabs={tabs} />
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export const Default: Story = {
  args: {
    //
  },
  parameters: {
    layout: 'centered',
  },
};
