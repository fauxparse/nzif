import React, { useMemo } from 'react';
import { first, last, range } from 'lodash-es';
import { DateTime } from 'luxon';

import { useTimetableQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';

import Context from './Context';
import Grid from './Grid';

import './Timetable.css';

const Timetable: React.FC = () => {
  const { data } = useTimetableQuery();

  const granularity = 4;
  const startHour = 9;
  const endHour = 26;

  const festival = data?.festival || null;
  const slots = festival?.timetable?.slots || [];
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
        slots,
        festival,
      }}
    >
      <div className="timetable">
        <header className="page__header">
          <Breadcrumbs />
          <h1>Timetable</h1>
        </header>
        <div className="timetable__grid">
          <Grid slots={slots} />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Timetable;
