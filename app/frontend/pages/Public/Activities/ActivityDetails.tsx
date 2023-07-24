import { useMemo } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { uniqBy, upperFirst } from 'lodash-es';

import Placename from '@/atoms/Placename';
import { Placename as PlacenameType, useActivityDetailsQuery } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';
import { activityTypeFromPluralized, Pluralized } from '@/util/activityTypeLabel';
import sentence from '@/util/sentence';

type PresenterLocation = { city: PlacenameType; country: PlacenameType; local: boolean };

export const Component: React.FC = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ACTIVITY);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  const { loading, data } = useActivityDetailsQuery({ variables: { type, slug } });

  const activity = data?.festival?.activity;

  const presenters = useMemo(() => activity?.presenters || [], [activity]);

  const places = useMemo(
    () =>
      uniqBy(
        presenters
          .map(({ city, country }) => ({
            city,
            country,
            local: country?.id === 'NZ' || country?.id === 'AU',
          }))
          .filter((p) => p.city && p.country) as PresenterLocation[],
        ({ city, country }) => `${city.id}|${country.id}`
      ),
    [presenters]
  );

  return (
    <BreadcrumbProvider label={upperFirst(pluralizedType.replace(/-/g, ' '))} path={pluralizedType}>
      <div className="page">
        <PageHeader>
          <Breadcrumbs />
          <h1>
            <Skeleton text loading={loading}>
              {activity?.name || 'Loading…'}
            </Skeleton>
          </h1>
          <div className="activity-details__presenters">
            {sentence(presenters.map((p) => p.name))}{' '}
            {places.map(({ city, country, local }) => (
              <Placename
                key={city.id}
                name={local ? city.name : `${city.name}, ${country.name}`}
                traditionalName={
                  city.traditionalName
                    ? local
                      ? city.traditionalName
                      : `${city.traditionalName}, ${country.traditionalName || country.name}`
                    : undefined
                }
              />
            ))}
          </div>
        </PageHeader>
      </div>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'ActivityDetails';

export default Component;
