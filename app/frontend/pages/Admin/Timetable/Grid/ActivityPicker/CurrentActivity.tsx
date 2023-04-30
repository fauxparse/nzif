import { TimetableActivityFragment, TimetableSlotFragment } from '@/graphql/types';
import Popover from '@/molecules/Popover';

type CurrentActivityProps = {
  activity: TimetableActivityFragment;
  slot: TimetableSlotFragment;
};

const location = (venue: { room: string | null; building: string }) =>
  venue.room ? `in ${venue.room}` : `at ${venue.building}`;

const CurrentActivity: React.FC<CurrentActivityProps> = ({ activity, slot }) => {
  return (
    <>
      <Popover.Header>
        <h3 className="popover__title">{activity.name}</h3>
        <h4>
          <time dateTime={slot.startsAt.toISODate() || undefined}>
            {slot.startsAt.toFormat('h:mm a')}
          </time>
          {' to '}
          <time dateTime={slot.startsAt.toISODate() || undefined}>
            {slot.endsAt.toFormat('h:mm a')}
          </time>{' '}
          {slot.venue && location(slot.venue)}
        </h4>
        <Popover.Close />
      </Popover.Header>
    </>
  );
};

export default CurrentActivity;
