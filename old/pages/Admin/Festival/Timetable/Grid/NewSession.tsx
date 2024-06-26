import { groupBy, pick, range, uniqueId } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useMemo, useReducer } from 'react';

import Button from '@/atoms/Button';
import Checkbox from '@/atoms/Checkbox';
import {
  ActivityType,
  Scalars,
  TimetableSessionFragmentDoc,
  useCreateSessionsMutation,
} from '@/graphql/types';
import Scrollable from '@/helpers/Scrollable';
import { Region } from '@/molecules/Grid/Grid.types';
import Popover from '@/molecules/Popover';
import Select from '@/molecules/Select';
import activityTypeLabel from '@/util/activityTypeLabel';
import { useTimetableContext } from '../Context';

import { useGridContext } from './Context';

type NewSessionProps = {
  selection: Region;
  onClose: () => void;
};

type State = {
  activityType: ActivityType;
  venueIds: Set<Scalars['ID']>;
  dates: { startsAt: DateTime; endsAt: DateTime }[];
  selectedDateIndexes: Set<number>;
};

type Action =
  | {
      type: 'SELECT_ACTIVITY_TYPE';
      activityType: ActivityType;
    }
  | {
      type: 'SELECT_VENUE_ID';
      venueId: Scalars['ID'];
      selected: boolean;
    }
  | {
      type: 'SELECT_DATE';
      index: number;
      selected: boolean;
    }
  | {
      type: 'RESET';
      selection: Region;
    };

const ACTIVITY_TYPE_OPTIONS = Object.values(ActivityType).map((value) => ({
  value,
  label: activityTypeLabel(value),
}));

const NewSession: React.FC<NewSessionProps> = ({ selection, onClose }) => {
  const { cellToTime, timeToCell } = useGridContext();

  const { venues, sessions, festival } = useTimetableContext();

  const makeState = ({ selection }: { selection: Region }): State => {
    const dates = range(selection.row, selection.row + selection.height).map((row) => ({
      startsAt: cellToTime({ row, column: selection.column }),
      endsAt: cellToTime({ row, column: selection.column + selection.width }),
    }));
    return {
      activityType: ActivityType.Workshop,
      dates,
      selectedDateIndexes: new Set(range(dates.length)),
      venueIds: new Set(),
    };
  };

  const [{ dates, selectedDateIndexes, activityType, venueIds }, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case 'SELECT_ACTIVITY_TYPE':
          return { ...state, activityType: action.activityType };
        case 'SELECT_VENUE_ID': {
          const venueIds = new Set(state.venueIds);
          if (action.selected) {
            venueIds.add(action.venueId);
          } else {
            venueIds.delete(action.venueId);
          }
          return { ...state, venueIds };
        }
        case 'SELECT_DATE': {
          const selectedDateIndexes = new Set(state.selectedDateIndexes);
          if (action.selected) {
            selectedDateIndexes.add(action.index);
          } else {
            selectedDateIndexes.delete(action.index);
          }
          return { ...state, selectedDateIndexes };
        }
        case 'RESET':
          return makeState(action);
      }
    },
    { selection, venues },
    makeState
  );

  const selectedDates = useMemo(
    () => dates.filter((_, i) => selectedDateIndexes.has(i)),
    [dates, selectedDateIndexes]
  );

  const busyVenueIds = useMemo(() => {
    const datesByRow = groupBy(selectedDates, (session) => timeToCell(session.startsAt).row);
    const sessionsByRow = pick(
      groupBy(sessions, (session) => timeToCell(session.startsAt).row),
      Object.keys(datesByRow)
    );
    return new Set(
      Object.keys(datesByRow)
        .map((date) => ({
          newSessions: datesByRow[date],
          existingSessions: sessionsByRow[date] || [],
        }))
        .flatMap(({ newSessions, existingSessions }) =>
          existingSessions
            .filter(
              (session) =>
                session.venue?.id &&
                newSessions.some((s) => s.startsAt < session.endsAt && s.endsAt > session.startsAt)
            )
            .map((session) => session.venue?.id)
            .filter(Boolean)
        )
    );
  }, [selectedDates, sessions, timeToCell]);

  const sessionCount = selectedDates.length * venueIds.size;

  const [createSessions] = useCreateSessionsMutation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!festival) return;

    createSessions({
      variables: {
        attributes: {
          festivalId: festival.id,
          venueIds: Array.from(venueIds),
          activityType,
          timeRanges: selectedDates,
        },
      },
      update: (cache, { data }) => {
        if (!data?.createSessions) return;

        const refs = data.createSessions.sessions.map((session) =>
          cache.writeFragment({
            fragment: TimetableSessionFragmentDoc,
            fragmentName: 'TimetableSession',
            data: session,
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
        __typename: 'Mutation',
        createSessions: {
          __typename: 'CreateMultipleSessionsPayload',
          sessions: selectedDates.flatMap((date) =>
            Array.from(venueIds).map((venueId) => ({
              __typename: 'Session',
              id: uniqueId('session_'),
              ...date,
              activityType,
              venue: venues.find((venue) => venue.id === venueId) || null,
              activity: null,
            }))
          ),
        },
      },
    });
  };

  return (
    <>
      <Popover.Header>
        <h3 className="popover__title">Add {selection.height > 1 ? 'sessions' : 'session'}</h3>
        <h4>
          <time dateTime={dates[0].startsAt.toISODate() || undefined}>
            {dates[0].startsAt.toFormat('h:mm a')}
          </time>
          {' to '}
          <time dateTime={dates[0].startsAt.toISODate() || undefined}>
            {dates[0].endsAt.toFormat('h:mm a')}
          </time>
        </h4>
        <Popover.Close />
      </Popover.Header>
      <Scrollable className="popover__body new-session">
        <form id="new-session" onSubmit={submit}>
          <ul
            className="new-session__options new-session__dates"
            style={{ gridTemplateRows: `repeat(${Math.ceil(dates.length / 2)}, auto)` }}
          >
            {dates.map((session, index) => (
              <li key={session.startsAt.valueOf()}>
                <label className="new-session__date">
                  <Checkbox
                    name="day"
                    value={index}
                    checked={selectedDateIndexes.has(index)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({ type: 'SELECT_DATE', index, selected: e.currentTarget.checked })
                    }
                  />
                  <time dateTime={session.startsAt.toISODate() || undefined}>
                    <span>{session.startsAt.toFormat('ccc d')}</span>
                  </time>
                </label>
              </li>
            ))}
          </ul>
          <Select
            options={ACTIVITY_TYPE_OPTIONS}
            value={activityType}
            onChange={(activityType: ActivityType) =>
              dispatch({ type: 'SELECT_ACTIVITY_TYPE', activityType })
            }
          />
          <ul className="new-session__options">
            {venues.map((venue) => (
              <li key={venue.id}>
                <label aria-disabled={busyVenueIds.has(venue.id) || undefined}>
                  <Checkbox
                    name="venueId"
                    value={venue.id}
                    disabled={busyVenueIds.has(venue.id) || undefined}
                    checked={venueIds.has(venue.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({
                        type: 'SELECT_VENUE_ID',
                        venueId: venue.id,
                        selected: e.currentTarget.checked,
                      })
                    }
                  />
                  <span>{venue.room || venue.building}</span>
                </label>
              </li>
            ))}
          </ul>
        </form>
      </Scrollable>
      <footer className="popover__footer">
        <Button
          primary
          type="submit"
          form="new-session"
          text={
            sessionCount
              ? `Add ${sessionCount} ${sessionCount > 1 ? 'sessions' : 'session'}`
              : 'Select venues'
          }
          disabled={sessionCount === 0 || undefined}
          onClick={onClose}
        />
      </footer>
    </>
  );
};

export default NewSession;
