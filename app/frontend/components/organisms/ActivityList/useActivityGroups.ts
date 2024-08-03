import { ActivityCardActivity, ActivityCardSession } from '@/components/molecules/ActivityCard';
import { orderBy, sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export type ScheduledActivity = {
  session: ActivityCardSession;
  activity: ActivityCardActivity;
};

type Period = 'all-day' | 'morning' | 'afternoon';

const sessionPeriod = (session: { startsAt: DateTime; endsAt: DateTime }): Period =>
  session.startsAt.hour < 12 ? (session.endsAt.hour > 13 ? 'all-day' : 'morning') : 'afternoon';

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
        const date = `${scheduled.session.startsAt.toISODate()}:${sessionPeriod(scheduled.session)}`;
        const group = map.get(date) || ([] as ScheduledActivity[]);
        group.push(scheduled);
        map.set(date, group);
        return map;
      }, new Map<string, ScheduledActivity[]>()),
    [sessions]
  );

  const sorted = useMemo(
    () =>
      orderBy(
        [...byDate.entries()],
        [([_, a]) => a[0].session.startsAt, ([_, a]) => a[0].session.endsAt],
        ['asc', 'desc']
      ).map(([d, activities]) => [
        activities[0].session.startsAt,
        sortBy(activities, ({ session }) => session.startsAt),
      ]) as [DateTime, ScheduledActivity[]][],
    [byDate]
  );

  return sorted;
};
