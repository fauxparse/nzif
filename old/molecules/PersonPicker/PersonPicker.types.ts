import { InputProps } from '@/atoms/Input';
import { Maybe, Scalars } from '@/graphql/types';

export interface Profile {
  id: Scalars['ID'];
  name: string;
  picture: Maybe<{ __typename: 'ProfilePicture'; id: string; small: string }>;
}

export type PersonPickerProps<T extends Profile = Profile> = Omit<
  InputProps<'div'>,
  'value' | 'onChange'
> & {
  value: T[];
  placeholder?: string;
  onChange: (value: T[]) => void;
  onSearch: (query: string) => Promise<T[]>;
  onCreate: (person: T) => Promise<T>;
};
