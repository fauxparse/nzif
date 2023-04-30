import { Maybe, TimetableActivityFragment, TimetableSlotFragment } from '@/graphql/types';
import Popover, { PopoverProps } from '@/molecules/Popover';

import ActivitySearch from './ActivitySearch';
import CurrentActivity from './CurrentActivity';

import './ActivityPicker.css';

type ActivityPickerProps = Omit<PopoverProps, 'slot'> & {
  activity: Maybe<TimetableActivityFragment>;
  slot: TimetableSlotFragment;
};

const ActivityPicker: React.FC<ActivityPickerProps> = ({ activity, slot, ...props }) => (
  <Popover
    className="activity-picker"
    placement={activity ? 'right' : 'right-start'}
    offset={{ mainAxis: 8, crossAxis: activity ? 0 : 11 }}
    {...props}
  >
    {activity ? (
      <CurrentActivity activity={activity} slot={slot} />
    ) : (
      <ActivitySearch activityType={slot.activityType} slot={slot} />
    )}
  </Popover>
);

export default ActivityPicker;
