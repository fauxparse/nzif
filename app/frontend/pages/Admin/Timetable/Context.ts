import { createContext } from 'react';
import { DateTime } from 'luxon';

export default createContext(
  {} as {
    startHour: number;
    endHour: number;
    granularity: number;
    dates: DateTime[];
    startDate: DateTime;
    endDate: DateTime;
  }
);
