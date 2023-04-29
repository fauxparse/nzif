import React, { useMemo, useReducer } from 'react';
import { groupBy, pick, range, uniqueId } from 'lodash-es';
import { DateTime } from 'luxon';

import { useTimetableContext } from '../Context';
import Button from '@/atoms/Button';
import Checkbox from '@/atoms/Checkbox';
import {
  ActivityType,
  Scalars,
  TimetableSlotFragmentDoc,
  useCreateSlotsMutation,
} from '@/graphql/types';
import Scrollable from '@/helpers/Scrollable';
import { Region } from '@/molecules/Grid/Grid.types';
import Popover from '@/molecules/Popover';
import Select from '@/molecules/Select';
import activityTypeLabel from '@/util/activityTypeLabel';

import { useGridContext } from './Context';

type NewSlotProps = {
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

const NewSlot: React.FC<NewSlotProps> = ({ selection, onClose }) => {
  const { cellToTime, timeToCell } = useGridContext();

  const { venues, slots, festival } = useTimetableContext();

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
    const datesByRow = groupBy(selectedDates, (slot) => timeToCell(slot.startsAt).row);
    const slotsByRow = pick(
      groupBy(slots, (slot) => timeToCell(slot.startsAt).row),
      Object.keys(datesByRow)
    );
    return new Set(
      Object.keys(datesByRow)
        .map((date) => ({ newSlots: datesByRow[date], existingSlots: slotsByRow[date] || [] }))
        .flatMap(({ newSlots, existingSlots }) =>
          existingSlots
            .filter(
              (slot) =>
                slot.venue?.id &&
                newSlots.some((s) => s.startsAt < slot.endsAt && s.endsAt > slot.startsAt)
            )
            .map((slot) => slot.venue?.id)
            .filter(Boolean)
        )
    );
  }, [selectedDates, slots, timeToCell]);

  const slotCount = selectedDates.length * venueIds.size;

  const [createSlots] = useCreateSlotsMutation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!festival) return;

    createSlots({
      variables: {
        attributes: {
          festivalId: festival.id,
          venueIds: Array.from(venueIds),
          activityType,
          timeRanges: selectedDates,
        },
      },
      update: (cache, { data }) => {
        if (!data?.createSlots) return;

        const refs = data.createSlots.slots.map((slot) =>
          cache.writeFragment({ fragment: TimetableSlotFragmentDoc, data: slot })
        );

        cache.modify({
          id: cache.identify({ __typename: 'Timetable', id: festival.id }),
          fields: {
            slots: (existing) => [...existing, ...refs],
          },
        });
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createSlots: {
          __typename: 'CreateMultipleSlotsPayload',
          slots: selectedDates.flatMap((date) =>
            Array.from(venueIds).map((venueId) => ({
              __typename: 'Slot',
              id: uniqueId('slot_'),
              ...date,
              activityType,
              venue: venues.find((venue) => venue.id === venueId) || null,
            }))
          ),
        },
      },
    });
  };

  return (
    <>
      <Popover.Header>
        <h3 className="popover__title">Add {selection.height > 1 ? 'slots' : 'slot'}</h3>
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
      <Scrollable className="popover__body new-slot">
        <form id="new-slot" onSubmit={submit}>
          <ul
            className="new-slot__options new-slot__dates"
            style={{ gridTemplateRows: `repeat(${Math.ceil(dates.length / 2)}, auto)` }}
          >
            {dates.map((slot, index) => (
              <li key={slot.startsAt.valueOf()}>
                <label className="new-slot__date">
                  <Checkbox
                    name="day"
                    value={index}
                    checked={selectedDateIndexes.has(index)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({ type: 'SELECT_DATE', index, selected: e.currentTarget.checked })
                    }
                  />
                  <time dateTime={slot.startsAt.toISODate() || undefined}>
                    <span>{slot.startsAt.toFormat('ccc d')}</span>
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
          <ul className="new-slot__options">
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
          form="new-slot"
          text={
            slotCount ? `Add ${slotCount} ${slotCount > 1 ? 'slots' : 'slot'}` : 'Select venues'
          }
          disabled={slotCount === 0 || undefined}
          onClick={onClose}
        />
      </footer>
    </>
  );
};

export default NewSlot;
