import { ActivityType } from '@/graphql/types';
import { CurrentFestival } from '@/hooks/useFestival';
import { range, uniqueId } from 'lodash-es';
import { ActivityCardActivity } from './ActivityCard';

export const useDummyActivities = (festival: CurrentFestival, type: ActivityType) => {
  const days = range(festival.endDate.diff(festival.startDate, 'days').as('days') + 1).map((i) =>
    festival.startDate.plus({ days: i })
  );
  return days.flatMap((date): ActivityCardActivity[] =>
    range(3).map(() => {
      const id = uniqueId();
      return {
        id,
        slug: id,
        name: 'Loading...',
        description: '',
        type,
        sessions: [
          {
            id,
            startsAt: date,
            endsAt: date,
          },
        ],
        presenters: [],
        picture: null,
      };
    })
  );
};
