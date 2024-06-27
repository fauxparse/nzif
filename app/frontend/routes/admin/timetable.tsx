import { TimetableEditor } from '@/components/organisms/TimetableEditor';
import {
  CreateActivityMutation,
  CreateSessionsMutation,
  DestroySessionMutation,
  TimetableQuery,
  TimetableSessionFragment,
  UpdateSessionMutation,
} from '@/components/organisms/TimetableEditor/queries';
import { Activity, Session } from '@/components/organisms/TimetableEditor/types';
import {
  ActivityAttributes,
  ActivityType,
  MultipleSessionAttributes,
  Permission,
  Scalars,
  SessionAttributes,
} from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import { RequirePermission } from '@/routes/admin';
import { Reference, useMutation, useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';
import { uniqueId } from 'lodash-es';
import { useCallback } from 'react';

export const Route = createFileRoute('/admin/timetable')({
  component: () => {
    const { loading, data } = useQuery(TimetableQuery);

    const festival = useFestival();

    const [createActivityMutation] = useMutation(CreateActivityMutation);

    const createActivity = useCallback(
      (type: ActivityType, attributes: Partial<ActivityAttributes>) =>
        new Promise<Activity>((resolve, reject) => {
          createActivityMutation({
            variables: {
              festivalId: festival.id,
              type,
              attributes,
            },
          })
            .then((result) => {
              const activity = result.data?.createActivity?.activity;
              if (activity) {
                resolve(activity);
              } else {
                reject();
              }
            })
            .catch(reject);
        }),
      [createActivityMutation]
    );

    const [createSessionsMutation] = useMutation(CreateSessionsMutation);

    const createSessions = useCallback(
      (attributes: MultipleSessionAttributes) =>
        createSessionsMutation({
          variables: { attributes },
          update: (cache, { data }) => {
            if (!data?.createSessions) return;

            const refs = data.createSessions.sessions.map((session) =>
              cache.writeFragment({
                fragment: TimetableSessionFragment,
                fragmentName: 'TimetableSession',
                data: session,
                id: session.id,
              })
            );

            cache.modify({
              id: cache.identify({ __typename: 'Timetable', id: festival.id }),
              fields: {
                sessions: (existing) => [...existing, ...refs],
              },
            });
          },
          optimisticResponse: {
            createSessions: {
              sessions: attributes.timeRanges.flatMap(({ startsAt, endsAt }) =>
                attributes.venueIds.map((venueId) => ({
                  __typename: 'Session',
                  id: uniqueId('session_'),
                  startsAt,
                  endsAt,
                  activityType: attributes.activityType,
                  venue: data?.festival?.venues?.find((venue) => venue.id === venueId) || null,
                  activity: null,
                  capacity: null,
                }))
              ),
            },
          },
        }),
      [createSessionsMutation]
    );

    const [updateSessionMutation] = useMutation(UpdateSessionMutation);

    const updateSession = useCallback(
      (id: Scalars['ID'], attributes: Partial<SessionAttributes>) => {
        const session = data?.festival?.timetable?.sessions?.find((s) => s.id === id);
        return updateSessionMutation({
          variables: { id, attributes },
          update: (cache, { data }) => {
            if (!data?.updateSession) return;

            cache.writeFragment({
              fragment: TimetableSessionFragment,
              fragmentName: 'TimetableSession',
              data: data.updateSession.session,
              id: cache.identify(data.updateSession.session),
            });
          },
          optimisticResponse: session
            ? {
                updateSession: {
                  session: {
                    __typename: 'Session',
                    ...session,
                    ...attributes,
                  } as Session,
                },
              }
            : undefined,
        });
      },
      [updateSessionMutation]
    );

    const [destroySessionMutation] = useMutation(DestroySessionMutation);

    const deleteSession = useCallback(
      (id: Scalars['ID']) =>
        destroySessionMutation({
          variables: { id },
          update: (cache, { data }) => {
            if (!data?.destroySession) return;

            cache.modify({
              id: cache.identify({ __typename: 'Timetable', id: festival.id }),
              fields: {
                sessions: (existing, { readField }) =>
                  existing.filter((session: Reference) => readField('id', session) !== id),
              },
            });
          },
        }),
      [destroySessionMutation, festival.id]
    );

    return (
      <RequirePermission permission={Permission.Activities}>
        <TimetableEditor
          loading={loading}
          data={data}
          onCreateSessions={createSessions}
          onCreateActivity={createActivity}
          onUpdateSession={updateSession}
          onDeleteSession={deleteSession}
        />
      </RequirePermission>
    );
  },
});
