import React from 'react';
import { randFullName, randJobTitle } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';
import { deburr } from 'lodash-es';

import { IconName } from '@/atoms/Icon';

import { Search } from './Search';
import { SearchResult } from './Search.types';

import './Search.css';

type Story = StoryObj<typeof Search>;

export default {
  title: 'Molecules/Search',
  component: Search,
  argTypes: {},
  args: {},
  render: (args) => <Search {...args} />,
} satisfies Meta<typeof Search>;

const PEOPLE = new Array(1000).fill(null).map((_, i) => {
  const title = randFullName();

  const description = randJobTitle();

  return {
    id: String(i),
    title,
    description,
    url: '#',
    icon: 'user' as IconName,
    deburred: deburr(`${title}|${description}`.toLocaleLowerCase()),
  };
});

export const Default: Story = {
  args: {
    onMeasure: () => ({ left: -200, right: -100 }),
    onSearch: (query) =>
      new Promise<SearchResult[]>((resolve) =>
        setTimeout(() => {
          const q = deburr(query.toLocaleLowerCase());
          resolve(PEOPLE.filter((p) => p.deburred.includes(q)).slice(0, 5));
        }, 500)
      ),
    // eslint-disable-next-line no-console
    onResultClick: console.log,
  },
  parameters: {
    layout: 'centered',
  },
};
