import Body from '@/components/organisms/Body';
import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import Header from '@/components/organisms/Header';
import { ActivityType } from '@/graphql/types';
import { useFestivalDates } from '@/hooks/useFestival';
import { useRegistration } from '@/services/Registration';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { groupBy, range, sortBy, values } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { CalendarProvider } from './Context';
import { Day } from './Day';
import { CalendarQuery, SetSessionVisibilityMutation } from './queries';
import { CalendarSession } from './types';

import ShareIcon from '@/icons/ShareIcon';
import { useAuthentication } from '@/services/Authentication';
import { IconButton } from '@radix-ui/themes';
import classes from './Calendar.module.css';

export const Calendar: React.FC = () => {
  const { loading, data } = useQuery(CalendarQuery);

  const { user } = useAuthentication();

  const { leaveSession, leaveWaitlist } = useRegistration();

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
                  slug: 'loading',
                  name: 'Loading...',
                  presenters: [],
                },
                activityType: ActivityType.Workshop,
                venue: null,
              },
              hidden: false,
              waitlisted: false,
              full: false,
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

  const { confirm } = useConfirmation();

  const { cache } = useApolloClient();

  const leave = (id: CalendarSession['id']) => {
    const session = sessions.find((s) => s.id === id);

    if (!session || !data?.calendar) return;

    confirm({
      title: session.waitlisted ? 'Leave waitlist' : 'Leave session',
      children: (
        <>
          <p>
            Are you sure you want to leave{session.waitlisted && ' the waitlist for'} this session?
          </p>
          {!session.waitlisted && session.full && (
            <p>This session is currently full, so someone else will be given your spot.</p>
          )}
        </>
      ),
    }).then(() => {
      (session.waitlisted ? leaveWaitlist : leaveSession)(id);
      cache.evict({ id: cache.identify(session) });
    });
  };

  return (
    <CalendarProvider {...{ show, hide, leave }}>
      <Header
        title="My calendar"
        actions={
          user && (
            <IconButton asChild variant="ghost" radius="full" size="3">
              <a href={`webcal://${location.host}/calendar/${user.id}.ics`}>
                <ShareIcon />
              </a>
            </IconButton>
          )
        }
      />
      <Body className={classes.calendar}>
        {days.map((day) => (
          <Day
            loading={loading}
            key={day[0].session.startsAt.toISODate()}
            date={day[0].session.startsAt}
            sessions={day as CalendarSession[]}
          />
        ))}
      </Body>
    </CalendarProvider>
  );
};
