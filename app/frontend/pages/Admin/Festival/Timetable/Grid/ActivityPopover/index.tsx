import { useCallback } from 'react';

import { useTimetableContext } from '../../Context';
import {
  ActivityAttributes,
  ActivitySearchQuery,
  ActivityType,
  Maybe,
  TimetableActivityFragment,
  TimetableSessionFragment,
  useActivitySearchLazyQuery,
  useCreateActivityMutation,
} from '@/graphql/types';
import Popover, { PopoverProps } from '@/molecules/Popover';
import ActivityPicker from '@/organisms/ActivityPicker';

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

const ActivityPopover: React.FC<ActivityPopoverProps> = ({ activity, session, ...props }) => {
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

  return (
    <Popover
      className="activity-popover"
      placement={activity ? 'right' : 'right-start'}
      offset={{ mainAxis: 8, crossAxis: 0 }}
      initialFocus={-1}
      {...props}
    >
      {activity ? (
        <CurrentActivity activity={activity} session={session} />
      ) : (
        <ActivityPicker
          activityType={activityType}
          onCreate={handleCreate}
          onSearch={handleSearch}
        />
      )}
    </Popover>
  );
};

export default ActivityPopover;
