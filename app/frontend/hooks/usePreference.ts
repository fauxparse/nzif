import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';

import {
  PreferenceValue,
  useGetPreferenceQuery,
  useUpdatePreferenceMutation,
} from '../graphql/types';

gql`
  query GetPreference($id: String!) {
    preference(id: $id) {
      id
      ...PreferenceValueFragment
    }
  }

  mutation UpdatePreference($id: String!, $value: PreferenceValue!) {
    updatePreference(id: $id, value: $value) {
      id
      ...PreferenceValueFragment
    }
  }

  fragment PreferenceValueFragment on Preference {
    ... on StringPreference {
      valueAsString: value
    }

    ... on BooleanPreference {
      valueAsBoolean: value
    }
  }
`;

const usePreference = <T extends boolean | string>(
  id: string,
  defaultValue?: T
): [T | undefined, (value: T) => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  const { data } = useGetPreferenceQuery({ variables: { id } });

  useEffect(() => {
    if (!data?.preference) return;
    switch (data.preference.__typename) {
      case 'BooleanPreference':
        setValue(data.preference.valueAsBoolean as T);
        break;
      case 'StringPreference':
        setValue(data.preference.valueAsString as T);
        break;
    }
  }, [data]);

  const [doUpdate] = useUpdatePreferenceMutation();

  const updateValue = (newValue: T) => {
    const value = {} as PreferenceValue;
    if (newValue === true || newValue === false) {
      value.boolean = newValue;
    } else {
      value.string = newValue;
    }
    doUpdate({ variables: { id, value } });
    setValue(newValue);
  };

  return [value as T, updateValue];
};

export default usePreference;
