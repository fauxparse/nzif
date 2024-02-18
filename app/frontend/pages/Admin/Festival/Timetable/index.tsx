import { first, last, range } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';

import { useTimetableQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';

import Context from './Context';
import Grid from './Grid';

import './Timetable.css';

export const Component: React.FC = () => {
  const { data } = useTimetableQuery();

  const granularity = 4;
  const startHour = 9;
  const endHour = 26;

  const festival = data?.festival || null;
  const sessions = festival?.timetable?.sessions || [];
  const venues = festival?.venues || [];

  const dates = useMemo(() => {
    const [startDate, rows] = data
      ? [
          data.festival.startDate,
          data.festival.endDate.diff(data.festival.startDate, 'days').days + 1,
        ]
      : [DateTime.now().startOf('day'), 8];
    return range(rows).map((days) => startDate.plus({ days }));
  }, [data]);

  return (
    <Context.Provider
      value={{
        startHour,
        endHour,
        granularity,
        startDate: first(dates) as DateTime,
        endDate: last(dates) as DateTime,
        dates,
        venues,
        sessions,
        festival,
      }}
    >
      <div className="timetable">
        <PageHeader>
          <Breadcrumbs />
          <h1>Timetable</h1>
        </PageHeader>
        <div className="timetable__grid">
          <Grid sessions={sessions} />
        </div>
      </div>
    </Context.Provider>
  );
};

Component.displayName = 'Timetable';

export default Component;
