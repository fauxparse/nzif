import { useMemo } from 'react';

import Icon from '@/atoms/Icon';
import { useMasterCastListQuery } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';

import CastList, { Day, Slot } from './CastList';

import './Casting.css';

export const Component: React.FC = () => {
  const { data } = useMasterCastListQuery();

  const days = useMemo(
    () =>
      (data?.festival?.slots || ([] as Slot[])).reduce<Day[]>((acc: Day[], slot: Slot) => {
        const date = slot.startsAt.startOf('day');
        const prev = acc[acc.length - 1];

        if (!slot.sessions.length) return acc;

        if (prev?.date?.equals(date)) {
          prev.sessions = prev.sessions.concat(slot.sessions);
          return acc;
        }

        acc.push({ date, sessions: slot.sessions });
        return acc;
      }, [] as Day[]),
    [data]
  );

  return (
    <BreadcrumbProvider path="directing" label="Casting">
      <div className="master-cast-list">
        <PageHeader>
          <Breadcrumbs />
          <h1>Master cast list</h1>
        </PageHeader>

        <div className="inset">
          {days.map((day) => (
            <details key={day.date.valueOf()}>
              <summary>
                <Icon name="chevronRight" />
                <h2>{day.date.plus(0).toFormat('EEEE')}</h2>
              </summary>
              <div className="cast-lists">
                {day.sessions.map((session) => (
                  <CastList key={session.id} session={session} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
