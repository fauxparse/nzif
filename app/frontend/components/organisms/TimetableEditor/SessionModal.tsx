import { Modal, ModalProps } from '@/components/molecules/Modal';
import { ActivityType } from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import CalendarIcon from '@/icons/CalendarIcon';
import ClockIcon from '@/icons/ClockIcon';
import LocationIcon from '@/icons/LocationIcon';
import UsersIcon from '@/icons/UsersIcon';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  NumberInput,
  SegmentedControl,
  Select,
  Text,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { createFormFactory } from '@tanstack/react-form';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Session } from './types';

import { ActivityPicker } from './ActivityPicker';
import './SessionModal.css';

type SessionModalProps = ModalProps & {
  session: Session;
  venues: NonNullable<Session['venue']>[];
};

type SessionWithMultipleVenues = Session & { venues: string[] };

const formFactory = createFormFactory<SessionWithMultipleVenues>({
  defaultValues: {
    id: '',
    startsAt: DateTime.now(),
    endsAt: DateTime.now(),
    venue: null,
    activity: null,
    activityType: ActivityType.Workshop,
    capacity: 16,
    venues: [] as string[],
  },
});

export const SessionModal: React.FC<SessionModalProps> = ({
  session: initial,
  venues,
  ...props
}) => {
  const [session, setSession] = useState(initial);

  useEffect(() => {
    if (initial) setSession(initial);
  }, [initial]);

  const festival = useFestival();

  const form = formFactory.useForm({
    defaultValues: {
      ...session,
      venues: session.venue ? [String(session.venue.id)] : [],
    },
    validators: {
      onChange: ({ value: { startsAt, endsAt } }) => {
        if (startsAt > endsAt) {
          return 'A session can’t end before it starts';
        }
      },
    },
    onSubmit: ({ value }) => {
      console.log({ value });
    },
  });

  const sessionCount = form.useStore(({ values: { startsAt, endsAt, venues } }) =>
    endsAt
      ? Math.max(
          endsAt
            .minus({ days: endsAt.hour < startsAt.hour ? 1 : 0 })
            .startOf('day')
            .diff(startsAt.startOf('day'), 'days').days + 1,
          1
        ) * Math.max(venues.length, 1) || 1
      : 0
  );

  const multipleDates =
    !session.startsAt.hasSame(session.endsAt, 'day') || session.endsAt.hour < session.startsAt.hour;

  const formErrorMap = form.useStore((state) => state.errorMap);

  const [isFormValid, isFormDirty] = form.useStore((state) => [state.isFormValid, state.isTouched]);

  return (
    <Modal
      className="session-modal"
      title={`${!session.id ? 'New' : 'Edit'} session`}
      centered
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="session-modal__activity-type">
          <form.Field name="activityType">
            {(field) => (
              <SegmentedControl
                fullWidth
                value={field.state.value}
                data={[
                  ActivityType.Workshop,
                  ActivityType.Show,
                  ActivityType.SocialEvent,
                  ActivityType.Conference,
                ].map((type) => ({
                  label: type.replace(/Event$/, ''),
                  value: type,
                  disabled: !!session.activity && session.activity.type !== type,
                }))}
                onChange={(value) => field.handleChange(value as ActivityType)}
              />
            )}
          </form.Field>
        </div>

        <Collapse in={sessionCount === 1 && !formErrorMap.onChange}>
          <form.Field name="activity">
            {(field) => (
              <ActivityPicker
                value={field.state.value}
                activityType={session.activityType}
                startsAt={session.startsAt}
                onDetailsClick={console.log}
                onAddActivity={console.log}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
        </Collapse>

        <Collapse in={!!formErrorMap.onChange}>
          <Alert color="red" className="session-modal__error">
            {formErrorMap.onChange}
          </Alert>
        </Collapse>

        <div className="session-modal__date-and-time">
          <div className="session-modal__date">
            <form.Field name="startsAt">
              {(field) => (
                <DatePickerInput
                  value={field.state.value.toJSDate()}
                  valueFormat="dddd, D MMM"
                  minDate={festival.startDate.toJSDate()}
                  maxDate={festival.endDate.toJSDate()}
                  leftSection={<CalendarIcon />}
                  onChange={(value) => {
                    if (value) {
                      const t = DateTime.fromJSDate(value);
                      field.handleChange(
                        field.getValue().set({ year: t.year, month: t.month, day: t.day })
                      );
                    }
                  }}
                />
              )}
            </form.Field>
            {!!session && multipleDates && (
              <form.Subscribe<DateTime> selector={(state) => state.values.startsAt}>
                {(minDate) => (
                  <>
                    <Text>to</Text>
                    <form.Field name="endsAt">
                      {(field) => (
                        <DatePickerInput
                          value={field.state.value.toJSDate()}
                          valueFormat="dddd, D MMM"
                          minDate={minDate.toJSDate()}
                          maxDate={festival.endDate.plus({ days: 1 }).toJSDate()}
                          leftSection={<CalendarIcon />}
                          onChange={(value) => {
                            if (value) {
                              const t = DateTime.fromJSDate(value);
                              field.handleChange(
                                field.getValue().set({ year: t.year, month: t.month, day: t.day })
                              );
                            }
                          }}
                        />
                      )}
                    </form.Field>
                  </>
                )}
              </form.Subscribe>
            )}
          </div>
          <div className="session-modal__time">
            <form.Field name="startsAt">
              {(field) => (
                <TimeInput
                  withSeconds={false}
                  value={field.state.value.toFormat('HH:mm')}
                  leftSection={<ClockIcon />}
                  onChange={(e) => {
                    const t = DateTime.fromFormat(e.currentTarget.value, 'HH:mm');
                    field.handleChange(field.getValue().set({ hour: t.hour, minute: t.minute }));
                  }}
                />
              )}
            </form.Field>
            <Text>to</Text>
            <form.Field name="endsAt">
              {(field) => (
                <TimeInput
                  withSeconds={false}
                  value={field.state.value.toFormat('HH:mm')}
                  leftSection={<ClockIcon />}
                  onChange={(e) => {
                    const t = DateTime.fromFormat(e.currentTarget.value, 'HH:mm');
                    field.handleChange(field.getValue().set({ hour: t.hour, minute: t.minute }));
                  }}
                />
              )}
            </form.Field>
          </div>
        </div>

        <div className="session-modal__venues">
          {session.id ? (
            <form.Field name="venue">
              {(field) => (
                <Select
                  placeholder="Venue"
                  searchable
                  value={field.state.value ? String(field.state.value.id) : null}
                  leftSection={<LocationIcon />}
                  data={venues.map((v) => ({ label: v.room || v.building, value: String(v.id) }))}
                  onChange={(id) =>
                    field.handleChange(venues.find((v) => String(v.id) === id) || null)
                  }
                />
              )}
            </form.Field>
          ) : (
            <form.Field name="venues">
              {(field) => (
                <>
                  {venues.map((venue, i) => (
                    <Checkbox
                      key={venue.id}
                      checked={field.state.value.includes(String(venue.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.pushValue(String(venue.id));
                        } else {
                          const index = field.state.value.indexOf(String(venue.id));
                          if (index > -1) field.removeValue(index);
                        }
                      }}
                      label={venue.room || venue.building}
                    />
                  ))}
                </>
              )}
            </form.Field>
          )}
        </div>
        <form.Field name="capacity">
          {(field) => (
            <Box className="session-modal__participants">
              <NumberInput
                value={field.state.value ?? ''}
                min={0}
                max={100}
                leftSection={<UsersIcon />}
                onChange={(value: string | number | null) => {
                  if (!value && value !== 0) {
                    field.handleChange(null);
                  } else {
                    field.handleChange(parseInt(String(value), 10));
                  }
                }}
              />
              <Text>participants max</Text>
            </Box>
          )}
        </form.Field>
        {session.id ? (
          <Button variant="filled" type="submit" disabled={!isFormValid || !isFormDirty}>
            Save session
          </Button>
        ) : (
          <Button variant="filled" type="submit" disabled={!isFormValid}>
            {`Add ${sessionCount === 1 ? 'session' : `${sessionCount} sessions`}`}
          </Button>
        )}
      </form>
    </Modal>
  );
};
