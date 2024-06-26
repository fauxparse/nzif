import clsx from 'clsx';
import React, { forwardRef } from 'react';

import Select from '@/molecules/Select';

import { CountryPickerProps } from './CountryPicker.types';
import useCountries from './useCountries';

import './CountryPicker.css';

export const CountryPicker = forwardRef<HTMLButtonElement, CountryPickerProps>(
  (
    {
      className,
      useCountries: useCountriesHook = useCountries,
      placeholder = 'Select country…',
      ...props
    },
    ref
  ) => {
    const { loading, countries } = useCountriesHook();

    return (
      <Select
        ref={ref}
        className={clsx('country-picker', className)}
        options={countries}
        placeholder={placeholder}
        icon="country"
        disabled={loading}
        {...props}
      />
    );
  }
);

CountryPicker.displayName = 'CountryPicker';

export default CountryPicker;
