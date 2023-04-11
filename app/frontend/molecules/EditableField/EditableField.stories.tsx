import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import { EditableField } from './EditableField';

type Story = StoryObj<typeof EditableField>;

export default {
  title: 'Molecules/EditableField',
  component: EditableField,
  argTypes: {},
  args: {
    text: 'EditableField',
  },
  render: (args) => <EditableField {...args} />,
} satisfies Meta<typeof EditableField>;

export const Default: Story = {
  args: {
    //
  },
};
