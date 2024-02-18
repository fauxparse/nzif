import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { SelectOptionSeparator, isSeparator } from '../Select/Select.types';

import { CountryPickerOption } from './CountryPicker.types';

const useCountries = () => {
  const result = useQuery<CountryPickerOption[]>({
    queryKey: ['countries'],
    queryFn: () => fetch('/countries').then((res) => res.json()),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const countries = useMemo(() => {
    if (!result.data) return [];
    const countries = [...result.data];
    countries.splice(
      countries.findIndex((c) => !isSeparator(c) && !c.priority),
      0,
      SelectOptionSeparator
    );
    return countries;
  }, [result]);

  return { loading: result.isLoading, countries };
};

export default useCountries;
