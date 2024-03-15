import { DateTime } from 'luxon';
import { ActivityCardActivity, ActivityCardSession } from './ActivityCard';
import { useMemo } from 'react';
import { first, sortBy } from 'lodash-es';
import { ActivityType } from '@/graphql/types';

export type ScheduledActivity = {
  session: ActivityCardSession;
  activity: ActivityCardActivity;
};

export const useActivityGroups = (activities: ActivityCardActivity[]) => {
  const sessions = useMemo(
    () =>
      activities.flatMap((activity) =>
        activity.sessions.map((session: ActivityCardSession) => ({ session, activity }))
      ),
    [activities]
  );

  const byDate = useMemo<Map<string, ScheduledActivity[]>>(
    () =>
      sessions.reduce((map, scheduled: ScheduledActivity) => {
        const date =
          scheduled.session.startsAt
            .startOf(scheduled.activity.type === ActivityType.Workshop ? 'hour' : 'day')
            .toISO() || 'never';
        const group = map.get(date) || ([] as ScheduledActivity[]);
        group.push(scheduled);
        map.set(date, group);
        return map;
      }, new Map<string, ScheduledActivity[]>()),
    [sessions]
  );

  const sorted = useMemo(
    () =>
      sortBy([...byDate.entries()], first).map(([d, activities]) => [
        DateTime.fromISO(d),
        activities,
      ]) as [DateTime, ScheduledActivity[]][],
    [byDate]
  );

  return sorted;
};
