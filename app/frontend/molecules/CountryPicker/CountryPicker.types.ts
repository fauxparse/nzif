import { SelectProps } from '../Select';

export type CountryPickerOption = {
  value: string;
  label: string;
  priority?: boolean;
};

export type CountryPickerProps = Omit<SelectProps<string, CountryPickerOption>, 'options'> & {
  useCountries?: () => { loading: boolean; countries: CountryPickerOption[] };
};
