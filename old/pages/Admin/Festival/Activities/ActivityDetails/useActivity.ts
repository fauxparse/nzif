import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import { useActivityDetailsQuery } from '@/graphql/types';
import { Pluralized, activityTypeFromPluralized } from '@/util/activityTypeLabel';

const useActivity = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ADMIN.ACTIVITY);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  const { loading, data } = useActivityDetailsQuery({ variables: { type, slug } });

  return { loading, activity: data?.festival?.activity };
};

export default useActivity;
