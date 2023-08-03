import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { useActivityDetailsQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';
import { activityTypeFromPluralized, Pluralized } from '@/util/activityTypeLabel';

const useActivity = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ADMIN.ACTIVITY);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  const { loading, data } = useActivityDetailsQuery({ variables: { type, slug } });

  return { loading, activity: data?.festival?.activity };
};

export default useActivity;
