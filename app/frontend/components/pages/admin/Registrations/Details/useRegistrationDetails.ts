import { useQuery } from '@apollo/client';
import { VariablesOf } from 'gql.tada';
import { RegistrationDetailsQuery } from './queries';

type RegistrationId = VariablesOf<typeof RegistrationDetailsQuery>['id'];

export const useRegistrationDetails = (id: RegistrationId) => {
  const { loading, data } = useQuery(RegistrationDetailsQuery, { variables: { id } });

  const registration = data?.registration ?? null;

  return {
    loading,
    registration,
  };
};
