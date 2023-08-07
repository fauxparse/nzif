import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { usePersonQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';

import Profile from './Profile';

export const Component = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data } = usePersonQuery({ variables: { id } });

  if (!data?.person) return null;

  return <Profile person={data.person} />;
};
