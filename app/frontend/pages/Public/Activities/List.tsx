import { useMemo } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { groupBy, sortBy, toPairs } from 'lodash-es';
import { DateTime } from 'luxon';

import { ProgrammeQuery } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import { ROUTES } from '@/Routes';

import ActivityCard from './ActivityCard';

type ProgrammeActivity = ProgrammeQuery['festival']['activities'][number];

type ListProps = {
  loading: boolean;
  activities: ProgrammeActivity[];
};

const List: React.FC<ListProps> = ({ loading, activities }) => {
  const { year, type: pluralizedType } = useTypedParams(ROUTES.FESTIVAL.ACTIVITIES);

  const slots = useMemo(
    () =>
      sortBy(
        toPairs(
          groupBy(
            activities.filter((a) => !!a.sessions.length),
            (a) => a.sessions[0].startsAt.toISO()
          )
        ).map(([_, group]: [string, ProgrammeActivity[]]) => ({
          startsAt: group[0].sessions[0].startsAt,
          endsAt: group[0].sessions[0].endsAt,
          group,
        })),
        'startsAt'
      ),
    [activities]
  );

  const days = useMemo(
    () =>
      sortBy(
        toPairs(groupBy(slots, (s) => s.startsAt.toISODate())).map(([date, group]) => ({
          date: DateTime.fromISO(date),
          slots: group,
        })),
        'date'
      ),
    [slots]
  );

  return (
    <div className="programme__list" data-type={pluralizedType}>
      {days.map(({ date, slots }) => (
        <div className="programme__slot" key={date.valueOf()}>
          <h2>
            <Skeleton text loading={loading}>
              {date.plus(0).toFormat('EEEE d MMMM')}
            </Skeleton>
          </h2>
          {slots.map(({ startsAt, endsAt, group }) => (
            <div className="programme__slot" key={startsAt.valueOf()}>
              <h3>
                <Skeleton text loading={loading}>
                  {startsAt.toLocaleString(DateTime.TIME_SIMPLE)} to{' '}
                  {endsAt.toLocaleString(DateTime.TIME_SIMPLE)}
                </Skeleton>
              </h3>

              <div className="programme__activities">
                {group.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    loading={loading}
                    path={ROUTES.FESTIVAL.ACTIVITY.buildPath({
                      year,
                      type: pluralizedType,
                      slug: activity.slug,
                    })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default List;
