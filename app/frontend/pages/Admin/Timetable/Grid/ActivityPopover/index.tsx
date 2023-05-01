import { useCallback } from 'react';

import {
  ActivitySearchQuery,
  Maybe,
  TimetableActivityFragment,
  TimetableSlotFragment,
  useActivitySearchLazyQuery,
} from '@/graphql/types';
import Popover, { PopoverProps } from '@/molecules/Popover';
import ActivityPicker from '@/organisms/ActivityPicker';

import CurrentActivity from './CurrentActivity';

type ActivityPopoverProps = Omit<PopoverProps, 'slot'> & {
  activity: Maybe<TimetableActivityFragment>;
  slot: TimetableSlotFragment;
};

type ActivityResult = Extract<
  ActivitySearchQuery['search'][number],
  { __typename: 'ActivityResult' }
>;

const isActivityResult = (
  result: ActivitySearchQuery['search'][number]
): result is ActivityResult => result?.__typename === 'ActivityResult';

const ActivityPopover: React.FC<ActivityPopoverProps> = ({ activity, slot, ...props }) => {
  const [search] = useActivitySearchLazyQuery({});

  const { activityType } = slot;

  const handleSearch = useCallback(
    async (query: string): Promise<ActivityResult[]> =>
      search({ variables: { query, activityType } }).then((result) =>
        (result.data?.search || []).filter(isActivityResult)
      ),
    [activityType, search]
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
        <CurrentActivity activity={activity} slot={slot} />
      ) : (
        <ActivityPicker
          activityType={activityType}
          onCreate={console.log}
          onSearch={handleSearch}
        />
      )}
    </Popover>
  );
};

export default ActivityPopover;
