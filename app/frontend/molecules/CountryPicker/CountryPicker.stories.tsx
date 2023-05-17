import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import COUNTRIES from './countries.json';
import CountryPicker, { CountryPickerProps } from '.';

type Story = StoryObj<typeof CountryPicker>;

const CountryPickerDemo = (args: Omit<Partial<CountryPickerProps>, 'ref'>) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return <CountryPicker {...args} value={value} onChange={setValue} />;
};

export default {
  title: 'Molecules/CountryPicker',
  component: CountryPicker,
  argTypes: {},
  args: {
    useCountries: () => ({ loading: false, countries: COUNTRIES }),
    style: { width: '24rem' },
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => <CountryPickerDemo {...args} />,
} satisfies Meta<typeof CountryPicker>;

export const Default: Story = {
  args: {
    //
  },
};
