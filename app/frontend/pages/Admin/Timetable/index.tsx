import React, { useMemo } from 'react';
import { first, last, range } from 'lodash-es';
import { DateTime } from 'luxon';

import { useTimetableQuery } from '../../../graphql/types';
import Breadcrumbs from '../../../molecules/Breadcrumbs';
import BreadcrumbProvider from '../../../molecules/Breadcrumbs/BreadcrumbProvider';

import Context from './Context';
import Grid from './Grid';

import './Timetable.css';

const Timetable: React.FC = () => {
  const { data } = useTimetableQuery();

  const granularity = 4;
  const startHour = 9;
  const endHour = 26;

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        startDate: first(dates)!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        endDate: last(dates)!,
        dates,
      }}
    >
      <BreadcrumbProvider label="Timetable" path="timetable">
        <div className="timetable">
          <header className="page__header">
            <Breadcrumbs />
            <h1>Timetable</h1>
          </header>
          <div className="timetable__grid">
            <Grid />
          </div>
        </div>
      </BreadcrumbProvider>
    </Context.Provider>
  );
};

export default Timetable;
