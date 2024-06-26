import { randFullName } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';
import { deburr, range, sortBy, uniqueId } from 'lodash-es';
import React, { useState } from 'react';

import PersonPicker from '.';
import { Profile } from './PersonPicker.types';

type Story = StoryObj<typeof PersonPicker>;

const PersonPickerDemo = () => {
  const [people, setPeople] = React.useState<Profile[]>(() =>
    sortBy(
      range(100).map(() => ({ id: uniqueId(), name: randFullName(), picture: null })),
      'name'
    )
  );

  const [value, setValue] = useState<Profile[]>([]);

  const search = (query: string) =>
    new Promise<Profile[]>((resolve) => {
      setTimeout(() => {
        const re = new RegExp(deburr(query.toLowerCase()), 'i');
        resolve(people.filter((person) => deburr(person.name.toLowerCase()).match(re)));
      }, 500);
    });

  const create = ({ id, name, ...rest }: Profile) =>
    new Promise<Profile>((resolve) => {
      setTimeout(() => {
        const person = { id: uniqueId(), name, ...rest };
        setPeople((current) => sortBy([...current, person], 'name'));
        resolve(person);
      }, 1000);
    });

  return (
    <PersonPicker
      style={{ width: 'min(40rem, calc(100vw - 4rem))' }}
      value={value}
      placeholder="People"
      onChange={setValue}
      onSearch={search}
      onCreate={create}
    />
  );
};

export default {
  title: 'Molecules/PersonPicker',
  component: PersonPicker,
  argTypes: {},
  args: {},
  parameters: {
    layout: 'centered',
  },
  render: () => <PersonPickerDemo />,
} satisfies Meta<typeof PersonPicker>;

export const Default: Story = {
  args: {
    //
  },
};
