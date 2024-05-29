import { TimetableEditor } from '@/components/organisms/TimetableEditor';
import {
  CreateActivityMutation,
  CreateSessionsMutation,
  TimetableQuery,
  TimetableSessionFragment,
} from '@/components/organisms/TimetableEditor/queries';
import { Activity } from '@/components/organisms/TimetableEditor/types';
import {
  ActivityAttributes,
  ActivityType,
  MultipleSessionAttributes,
  Permission,
} from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import { RequirePermission } from '@/routes/admin';
import { useMutation, useQuery } from '@apollo/client';
import { createLazyFileRoute } from '@tanstack/react-router';
import { uniqueId } from 'lodash-es';
import { useCallback } from 'react';

const Component: React.FC = () => {
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

  return (
    <RequirePermission permission={Permission.Activities}>
      <TimetableEditor
        loading={loading}
        data={data}
        onCreateSessions={createSessions}
        onCreateActivity={createActivity}
      />
    </RequirePermission>
  );
};

export const Route = createLazyFileRoute('/admin/timetable')({
  component: Component,
});
