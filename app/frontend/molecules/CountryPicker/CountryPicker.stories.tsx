import React, { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SelectOptionSeparator } from '../Select/Select.types';

import COUNTRIES from './countries.json';
import CountryPicker, { CountryPickerProps } from '.';

type Story = StoryObj<typeof CountryPicker>;

const CountryPickerDemo = (args: Omit<Partial<CountryPickerProps>, 'ref'>) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const useCountries = useCallback(() => {
    const countries: ((typeof COUNTRIES)[number] | typeof SelectOptionSeparator)[] = [...COUNTRIES];
    countries.splice(2, 0, SelectOptionSeparator);
    return { loading: false, countries };
  }, []);

  return <CountryPicker useCountries={useCountries} {...args} value={value} onChange={setValue} />;
};

export default {
  title: 'Molecules/CountryPicker',
  component: CountryPicker,
  argTypes: {},
  args: {
    style: { width: '24rem' },
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => <CountryPickerDemo {...args} />,
} satisfies Meta<typeof CountryPicker>;

export const Default: Story = {};
