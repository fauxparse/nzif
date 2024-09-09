import { FragmentOf } from '@/graphql';
import { useQuery } from '@apollo/client';
import { VariablesOf } from 'gql.tada';
import React, { PropsWithChildren, useContext } from 'react';
import { RegistrationDetailsFragment, RegistrationDetailsQuery } from './queries';

export type RegistrationId = VariablesOf<typeof RegistrationDetailsQuery>['id'];

export type Registration = FragmentOf<typeof RegistrationDetailsFragment>;

type RegistrationDetailsContext = {
  loading: boolean;
  id: RegistrationId;
  registration: Registration | null;
};

const RegistrationDetailsContext = React.createContext<RegistrationDetailsContext>({
  id: '',
  loading: true,
  registration: null,
});

type RegistrationDetailsProviderProps = PropsWithChildren<{
  id: RegistrationId;
}>;

export const RegistrationDetailsProvider: React.FC<RegistrationDetailsProviderProps> = ({
  id,
  children,
}) => {
  const { loading, data } = useQuery(RegistrationDetailsQuery, { variables: { id } });

  const registration = data?.registration ?? null;

  return (
    <RegistrationDetailsContext.Provider value={{ id, loading, registration }}>
      {children}
    </RegistrationDetailsContext.Provider>
  );
};

export const useRegistrationDetails = () => useContext(RegistrationDetailsContext);
