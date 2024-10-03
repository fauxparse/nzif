import { Combobox } from '@/components/molecules/Combobox';
import { useLazyQuery } from '@apollo/client';
import { Box } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from 'react';
import { DirectorySearchQuery } from './queries';

import classes from './Directory.module.css';
import { Person } from './types';

type SearchProps = {
  person: Person | null;
  onChange: Dispatch<SetStateAction<Person | null>>;
};

export const Search: React.FC<SearchProps> = ({ person, onChange }) => {
  const [doSearch] = useLazyQuery(DirectorySearchQuery);

  const search = (query: string) =>
    doSearch({ variables: { query } }).then(
      ({ data }) => data?.directorySearch?.map((p) => ({ id: p.id, label: p.name })) ?? []
    );

  const select = (person: { id: Person['id']; label: string } | null) =>
    onChange(person && { id: person.id, name: person.label });

  return (
    <Box className={classes.search}>
      <Combobox.Root items={search} value={person} onSelect={select} placeholder="Search…" />
    </Box>
  );
};
