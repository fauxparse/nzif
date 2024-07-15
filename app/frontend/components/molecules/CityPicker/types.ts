import { Scalars } from '@/graphql/types';

export type CityPickerOption = {
  id: Scalars['ID'];
  label: string;
  value: string;
  name: string;
  traditionalNames: string[];
  country: string;
  countryCode: string;
};
