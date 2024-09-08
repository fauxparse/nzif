import { Combobox, ComboboxItem } from '@/components/molecules/Combobox';
import SearchIcon from '@/icons/SearchIcon';
import { useLazyQuery } from '@apollo/client';
import { useCallback } from 'react';
import { RegistrationSearchQuery } from './queries';
import { Registration } from './types';

import classes from './WorkshopSession.module.css';

type SearchResult = ComboboxItem & Registration;

type PersonPickerProps = {
  existing: Registration[];
  onSelect: (value: Registration) => void;
};

export const PersonPicker: React.FC<PersonPickerProps> = ({ existing, onSelect }) => {
  const [search] = useLazyQuery(RegistrationSearchQuery, {
    fetchPolicy: 'network-only',
  });

  const handleSearch = useCallback(
    (query: string) =>
      search({ variables: { query } }).then(({ data }) =>
        (data?.festival?.registrations ?? [])
          .filter((r) => !existing.some((e) => e.id === r.id))
          .map((r) => ({ ...r, label: r.user?.name || '' }))
      ),
    [search, existing]
  );

  const handleValueSelect = useCallback(
    (value: Registration | null) => {
      if (value) onSelect(value);
    },
    [onSelect]
  );

  return (
    <Combobox.Root<SearchResult>
      className={classes.personPicker}
      icon={<SearchIcon />}
      placeholder="Add someone…"
      value={null}
      items={handleSearch}
      onSelect={handleValueSelect}
    />
  );
};
