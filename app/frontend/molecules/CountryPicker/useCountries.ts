import { useQuery } from '@tanstack/react-query';

import { CountryPickerOption } from './CountryPicker.types';

const useCountries = () => {
  const result = useQuery<CountryPickerOption[]>({
    queryKey: ['countries'],
    queryFn: () => fetch('/countries').then((res) => res.json()),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  return { loading: result.isLoading, countries: result.data || [] };
};

export default useCountries;
