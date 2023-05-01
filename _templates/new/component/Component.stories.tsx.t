---
to: app/frontend/<%= h.inflection.pluralize(type) %>/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.stories.tsx
---
<% Name = h.changeCase.pascal(name) -%>
import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';

import <%= Name %> from '.';

type Story = StoryObj<typeof <%= Name %>>;

export default {
  title: '<%= h.inflection.capitalize(h.inflection.pluralize(type)) %>/<%= Name %>',
  component: <%= Name %>,
  argTypes: {},
  args: {
    text: '<%= Name %>',
  },
  render: (args) => <<%= Name %> {...args} />,
} satisfies Meta<typeof <%= Name %>>;

export const Default: Story = {
  args: {
    //
  },
};
