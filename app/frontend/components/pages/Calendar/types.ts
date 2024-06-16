import { ResultOf } from 'gql.tada';
import { CalendarQuery } from './queries';

type BaseCalendarSession = ResultOf<typeof CalendarQuery>['calendar'][number];

export type CalendarSession = Omit<BaseCalendarSession, 'session'> & {
  session: Omit<BaseCalendarSession['session'], 'activity'> & {
    activity: NonNullable<BaseCalendarSession['session']['activity']>;
  };
};
