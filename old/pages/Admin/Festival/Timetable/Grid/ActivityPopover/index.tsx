import { useCallback } from 'react';

import {
  ActivityAttributes,
  ActivitySearchQuery,
  ActivityType,
  Maybe,
  SessionAttributes,
  TimetableActivityFragment,
  TimetableSessionFragment,
  useActivitySearchLazyQuery,
  useCreateActivityMutation,
  useUpdateSessionMutation,
} from '@/graphql/types';
import Popover, { PopoverProps } from '@/molecules/Popover';
import ActivityPicker from '@/organisms/ActivityPicker';
import { useTimetableContext } from '../../Context';

import CurrentActivity from './CurrentActivity';

type ActivityPopoverProps = Omit<PopoverProps, 'session'> & {
  activity: Maybe<TimetableActivityFragment>;
  session: TimetableSessionFragment;
};

type ActivityResult = Extract<
  ActivitySearchQuery['search'][number],
  { __typename: 'ActivityResult' }
>;

const isActivityResult = (
  result: ActivitySearchQuery['search'][number]
): result is ActivityResult => result?.__typename === 'ActivityResult';

const ActivityPopover: React.FC<ActivityPopoverProps> = ({
  activity,
  session,
  onOpenChange,
  ...props
}) => {
  const { festival } = useTimetableContext();

  const [search] = useActivitySearchLazyQuery({});

  const { activityType } = session;

  const handleSearch = useCallback(
    async (query: string): Promise<ActivityResult[]> =>
      search({ variables: { query, activityType } }).then((result) =>
        (result.data?.search || []).filter(isActivityResult)
      ),
    [activityType, search]
  );

  const [create] = useCreateActivityMutation();

  const handleCreate = useCallback(
    (activityType: ActivityType, attributes: Partial<ActivityAttributes>) =>
      new Promise<TimetableActivityFragment>((resolve, reject) => {
        if (!festival) return reject();

        create({
          variables: {
            festivalId: festival.id,
            activityType,
            attributes: attributes as ActivityAttributes,
            sessionId: session.id,
          },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   createActivity: {
          //     __typename: 'CreateActivityPayload',
          //     activity: {
          //       __typename: activityType,
          //       id: uniqueId(),
          //       type: activityType as ActivityType,
          //       name: attributes.name || '',
          //       slug: attributes.slug || '',
          //     },
          //     session: {
          //       ...session,
          //       activity: {
          //         __typename: activityType,
          //         id: uniqueId(),
          //         type: activityType as ActivityType,
          //         name: attributes.name || '',
          //         slug: attributes.slug || '',
          //         tutors: [],
          //       },
          //     },
          //   },
          // },
        }).then(({ data }) => {
          if (!data?.createActivity?.activity) return reject();
          resolve(data.createActivity.activity);
        });
      }),
    [festival, create, session]
  );

  const [updateSession] = useUpdateSessionMutation();

  const handleSelect = useCallback(
    (activity: TimetableActivityFragment) => {
      onOpenChange(false);
      updateSession({
        variables: { id: session.id, attributes: { activityId: activity.id } as SessionAttributes },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSession: {
            __typename: 'UpdateSessionPayload',
            session: {
              ...session,
              activity,
            },
          },
        },
      });
    },
    [session, updateSession, onOpenChange]
  );

  return (
    <Popover
      className="activity-popover"
      placement={activity ? 'right' : 'right-start'}
      offset={{ mainAxis: 8, crossAxis: 0 }}
      initialFocus={-1}
      onOpenChange={onOpenChange}
      {...props}
    >
      {activity ? (
        <CurrentActivity activity={activity} session={session} />
      ) : (
        <ActivityPicker
          activityType={activityType}
          onCreate={handleCreate}
          onSearch={handleSearch}
          onSelect={handleSelect}
        />
      )}
    </Popover>
  );
};

export default ActivityPopover;
