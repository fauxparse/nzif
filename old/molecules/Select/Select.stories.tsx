import { randFullName } from '@ngneat/falso';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';

import { Select } from './Select';
import { SelectOption, SelectOptionSeparator, SelectProps, isSeparator } from './Select.types';

type Story = StoryObj<typeof Select>;

export default {
  title: 'Molecules/Select',
  component: Select,
  argTypes: {},
  args: {
    placeholder: 'Select…',
    options: [
      { value: 'red', label: 'Red' },
      { value: 'orange', label: 'Orange' },
      SelectOptionSeparator,
      { value: 'yellow', label: 'Yellow' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
      { value: 'indigo', label: 'Indigo' },
      { value: 'violet', label: 'Violet' },
    ],
  },
  parameters: { layout: 'centered' },
  render: (args) => <SelectDemo {...(args as SelectProps<string>)} />,
} satisfies Meta<typeof Select>;

const SelectDemo = ({
  options,
  placeholder,
  ...args
}: {
  options: SelectOption<string>[];
  placeholder?: string;
}) => {
  const [selected, setSelected] = React.useState<string | undefined>();

  const label = useMemo(
    () =>
      options.find((option) => !isSeparator(option) && option.value === selected)?.label ||
      placeholder,
    [options, placeholder, selected]
  );

  return (
    <Select
      options={options}
      value={selected}
      onChange={setSelected}
      text={label}
      style={{ width: 240 }}
      {...args}
    />
  );
};

export const Default: Story = {
  args: {},
};

export const Massive: Story = {
  args: {
    options: randFullName({ length: 100 }).map((name) => ({ value: name, label: name })),
  },
};
