import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import ShareIcon from '@/icons/ShareIcon';
import { useMutation, useQuery } from '@apollo/client';
import { ActionIcon } from '@mantine/core';
import { groupBy, range, sortBy, values } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { CalendarProvider } from './Context';
import { Day } from './Day';
import { CalendarQuery, SetSessionVisibilityMutation } from './queries';

import './Calendar.css';
import { ActivityType } from '@/graphql/types';
import { useFestivalDates } from '@/hooks/useFestival';
import { CalendarSession } from './types';

export const Calendar: React.FC = () => {
  const { loading, data } = useQuery(CalendarQuery);

  const dates = useFestivalDates();

  const sessions = useMemo<CalendarSession[]>(() => {
    if (loading) {
      return dates.flatMap((date) =>
        range(2).map(
          (i) =>
            ({
              id: `${date.toISODate()}${i}`,
              session: {
                id: `${date.toISODate()}:${i}`,
                startsAt: date.set({ hour: 10 }),
                endsAt: date.set({ hour: 13 }),
                activity: {
                  id: `${date.toISODate()}:${i}`,
                  name: 'Loading...',
                  presenters: [],
                },
                activityType: ActivityType.Workshop,
                venue: null,
              },
              hidden: false,
              waitlisted: false,
            }) satisfies CalendarSession
        )
      );
    }

    return (data?.calendar ?? []) as CalendarSession[];
  }, [loading, data]);

  const days = useMemo(
    () =>
      sortBy(
        values(groupBy(sessions, ({ session }) => session.startsAt.toISODate())),
        (group) => group[0].session.startsAt
      ),
    [sessions]
  );

  const [updateVisibility] = useMutation(SetSessionVisibilityMutation, {
    update: (cache, { data }) => {
      if (!data?.setSessionVisibility) return;

      const { hidden } = data.setSessionVisibility;

      cache.modify({
        id: cache.identify(data.setSessionVisibility),
        fields: {
          hidden: () => hidden,
        },
      });
    },
  });

  const show = useCallback((id: string) => {
    updateVisibility({
      variables: { sessionId: id, hidden: false },
      optimisticResponse: {
        setSessionVisibility: { id, hidden: false },
      },
    });
  }, []);

  const hide = useCallback((id: string) => {
    updateVisibility({
      variables: { sessionId: id, hidden: true },
      optimisticResponse: {
        setSessionVisibility: { id, hidden: true },
      },
    });
  }, []);

  return (
    <CalendarProvider show={show} hide={hide}>
      <div className="calendar">
        <Header
          title="My calendar"
          actions={
            <ActionIcon variant="subtle" data-color="neutral">
              <ShareIcon />
            </ActionIcon>
          }
        />
        <Body className="calendar">
          {days.map((day) => (
            <Day
              loading={loading}
              key={day[0].session.startsAt.toISODate()}
              date={day[0].session.startsAt}
              sessions={day as CalendarSession[]}
            />
          ))}
        </Body>
      </div>
    </CalendarProvider>
  );
};
