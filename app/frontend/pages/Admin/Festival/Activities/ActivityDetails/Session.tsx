import { DateTime } from 'luxon';
import { ChangeEvent, useContext, useMemo, useRef } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import Input from '@/atoms/Input';
import {
  ActivityType,
  useUpdateSessionCapacityMutation,
  useUpdateSessionVenueMutation,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';
import Select from '@/molecules/Select';

import Context from './Context';
import Participants from './Participants';
import ParticipantSearch from './Participants/ParticipantSearch';

export const Component: React.FC = () => {
  const { festival } = useContext(Context);

  const { date: dateAsString } = useTypedParams(ROUTES.ADMIN.ACTIVITY.SESSION);

  const activity = festival?.activity;

  const venues = useMemo(() => festival?.venues || [], [festival]);

  const sessions = useMemo(() => activity?.sessions || [], [activity]);

  const date = useMemo(
    () => (dateAsString ? DateTime.fromISO(dateAsString) : DateTime.now()),
    [dateAsString]
  );

  const session = useMemo(
    () => sessions.find((s) => s.startsAt.hasSame(date, 'day')),
    [sessions, date]
  );

  const venueOptions = useMemo(
    () => venues.map((v) => ({ value: v.id, label: v.room || v.building })),
    [venues]
  );

  const [updateVenue] = useUpdateSessionVenueMutation();

  const changeVenue = (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);

    if (!session || !venue) return;

    const { id } = session;

    return updateVenue({
      variables: { id, venueId },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSession: {
          __typename: 'UpdateSessionPayload',
          session: {
            __typename: 'Session',
            id,
            venue,
          },
        },
      },
    });
  };

  const [updateCapacity] = useUpdateSessionCapacityMutation();

  const changeCapacityTimer = useRef<number>();

  const changeCapacity = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(changeCapacityTimer.current);

    if (!session) return;

    const capacity = e.target.valueAsNumber;

    changeCapacityTimer.current = window.setTimeout(() => {
      const { id } = session;

      updateCapacity({
        variables: { id, capacity },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSession: {
            __typename: 'UpdateSessionPayload',
            session: {
              __typename: 'Session',
              id,
              capacity,
            },
          },
        },
      });
    }, 1000);
  };

  if (!session) return null;

  return (
    <div className="activity-session inset">
      <header className="activity-session__header">
        <h1>{date.toFormat('cccc d MMMM, h:mm a')}</h1>
        <div className="activity-session__actions">
          {activity?.type === ActivityType.Workshop && <ParticipantSearch session={session} />}
        </div>
      </header>
      <div>{activity?.type === ActivityType.Workshop && <Participants session={session} />}</div>
      <aside className="activity-session__meta">
        <Labelled label="Venue" name="venueId">
          <Select
            name="venueId"
            options={venueOptions}
            value={session.venue?.id}
            onChange={changeVenue}
          />
        </Labelled>
        {activity?.type === ActivityType.Workshop && (
          <Labelled label="Capacity" name="capacity">
            <Input
              name="capacity"
              type="number"
              min={1}
              defaultValue={session.capacity || 1}
              onChange={changeCapacity}
            />
          </Labelled>
        )}
      </aside>
    </div>
  );
};

Component.displayName = 'Session';

export default Component;
