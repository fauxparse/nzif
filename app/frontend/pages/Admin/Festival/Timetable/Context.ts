import { createContext, useContext } from 'react';
import { DateTime } from 'luxon';

import { TimetableQuery, TimetableSessionFragment } from '@/graphql/types';

const TimetableContext = createContext(
  {} as {
    startHour: number;
    endHour: number;
    granularity: number;
    dates: DateTime[];
    startDate: DateTime;
    endDate: DateTime;
    festival: TimetableQuery['festival'] | null;
    venues: TimetableQuery['festival']['venues'];
    sessions: TimetableSessionFragment[];
  }
);

export default TimetableContext;

export const useTimetableContext = () => useContext(TimetableContext);
