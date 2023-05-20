import { createContext, useContext } from 'react';

import { PersonQuery } from '@/graphql/types';

export const PersonContext = createContext(
  {} as {
    person: PersonQuery['person'] | null;
    permissions: PersonQuery['permissions'];
  }
);

export const usePerson = () => useContext(PersonContext).person;

export const usePermissions = () => useContext(PersonContext).permissions;
