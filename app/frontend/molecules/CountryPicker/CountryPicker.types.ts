import { SelectProps } from '../Select';
import { SelectOptionSeparator } from '../Select/Select.types';

export type CountryPickerOption =
  | {
      value: string;
      label: string;
      priority?: boolean;
    }
  | typeof SelectOptionSeparator;

export type CountryPickerProps = Omit<SelectProps<string, CountryPickerOption>, 'options'> & {
  useCountries?: () => { loading: boolean; countries: CountryPickerOption[] };
};
