import { Link } from 'react-router-dom';

import Button from '@/atoms/Button';
import { TimetableActivityFragment, TimetableSessionFragment } from '@/graphql/types';
import Popover from '@/molecules/Popover';
import { ROUTES } from '@/Routes';
import { adminActivityLink, pluralizeActivityType } from '@/util/activityTypeLabel';

type CurrentActivityProps = {
  activity: TimetableActivityFragment;
  session: TimetableSessionFragment;
};

const location = (venue: { room: string | null; building: string }) =>
  venue.room ? `in ${venue.room}` : `at ${venue.building}`;

const CurrentActivity: React.FC<CurrentActivityProps> = ({ activity, session }) => {
  return (
    <>
      <Popover.Header>
        <h3 className="popover__title">{activity.name}</h3>
        <h4>
          <time dateTime={session.startsAt.toISODate() || undefined}>
            {session.startsAt.toFormat('h:mm a')}
          </time>
          {' to '}
          <time dateTime={session.startsAt.toISODate() || undefined}>
            {session.endsAt.toFormat('h:mm a')}
          </time>{' '}
          {session.venue && location(session.venue)}
        </h4>
        <Popover.Close />
      </Popover.Header>
      <Popover.Footer>
        <Button as={Link} to={adminActivityLink(activity)} icon="edit" text="Edit" />
      </Popover.Footer>
    </>
  );
};

export default CurrentActivity;
