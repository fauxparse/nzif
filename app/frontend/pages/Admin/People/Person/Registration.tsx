import { useMemo } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { sortBy } from 'lodash-es';
import { DateTime } from 'luxon';

import { RegistrationStatusQuery, useRegistrationStatusQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';

export const Component = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data } = useRegistrationStatusQuery({ variables: { id } });

  const slots = useMemo(() => {
    if (!data?.registration) return new Map();

    return sortBy(data.registration.preferences, [
      'position',
      (preference) => preference.slot.startsAt,
    ]).reduce((map, preference) => {
      const group = map.get(preference.slot.startsAt) || [];
      group.push(preference);
      return map.set(preference.slot.startsAt, group);
    }, new Map<DateTime, (typeof data.registration.preferences)[number][]>());
  }, [data]);

  return (
    <div className="inset registration-summary">
      <h3>Preferences</h3>

      {Array.from(slots.entries()).map(([startsAt, group]) => (
        <section key={startsAt}>
          <h4>{startsAt.plus(0).toFormat('cccc d MMMM')}</h4>
          <ol className="registration-summary__preferences">
            {group.map(
              (preference: RegistrationStatusQuery['registration']['preferences'][number]) => (
                <li key={preference.position}>{preference.workshop.name}</li>
              )
            )}
          </ol>
        </section>
      ))}
    </div>
  );
};
