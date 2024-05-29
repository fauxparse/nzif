import { Modal, ModalProps } from '@/components/molecules/Modal';
import {
  ActivityAttributes,
  ActivityType,
  MultipleSessionAttributes,
  SessionAttributes,
} from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import CalendarIcon from '@/icons/CalendarIcon';
import ClockIcon from '@/icons/ClockIcon';
import LocationIcon from '@/icons/LocationIcon';
import UsersIcon from '@/icons/UsersIcon';
import { FetchResult } from '@apollo/client';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Text,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { createFormFactory } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import { useConfirmation } from '../ConfirmationModal';
import { ActivityPicker } from './ActivityPicker';
import { CreateSessionsMutation, DestroySessionMutation, UpdateSessionMutation } from './queries';
import { Activity, Session } from './types';

import './SessionModal.css';

type SessionModalProps = ModalProps & {
  session: Session;
  venues: NonNullable<Session['venue']>[];
  onCreateSessions: (
    attributes: MultipleSessionAttributes
  ) => Promise<FetchResult<ResultOf<typeof CreateSessionsMutation>>>;
  onCreateActivity: (
    type: ActivityType,
    attributes: Partial<ActivityAttributes>
  ) => Promise<Activity>;
  onUpdateSession: (
    id: Session['id'],
    attributes: Partial<SessionAttributes>
  ) => Promise<FetchResult<ResultOf<typeof UpdateSessionMutation>>>;
  onDeleteSession: (
    sessionId: Session['id']
  ) => Promise<FetchResult<ResultOf<typeof DestroySessionMutation>>>;
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
  onCreateSessions,
  onCreateActivity,
  onUpdateSession,
  onDeleteSession,
  onClose,
  ...props
}) => {
  const [session, setSession] = useState(initial);

  const festival = useFestival();

  const { confirm } = useConfirmation();

  useEffect(() => {
    if (initial) setSession(initial);
  }, [initial]);

  const createSessions = useCallback(
    (value: SessionWithMultipleVenues) => {
      const { startsAt, endsAt } = value;
      const datesCount =
        endsAt.startOf('day').diff(startsAt.startOf('day'), 'days').days +
        (endsAt.hour < startsAt.hour ? 0 : 1);
      const timeRanges = range(datesCount).map((i) => ({
        startsAt: startsAt.plus({ days: i }),
        endsAt: endsAt.plus({ days: i - datesCount + 1 }),
      }));

      onCreateSessions({
        activityType: value.activityType,
        timeRanges,
        festivalId: festival.id,
        venueIds: value.venues,
        activityId:
          (datesCount === 1 && value.venues.length <= 1 && value.activity && value.activity.id) ||
          null,
        capacity: value.activityType === ActivityType.Workshop ? value.capacity : null,
      }).then(onClose);
    },
    [festival, close]
  );

  const updateSession = useCallback(
    (value: SessionWithMultipleVenues) => {
      onUpdateSession(session.id, {
        activityType: value.activityType,
        startsAt: value.startsAt,
        endsAt: value.endsAt,
        venueId: value.venue?.id || null,
        activityId: value.activity?.id || null,
        capacity: value.activityType === ActivityType.Workshop ? value.capacity : null,
      }).then(onClose);
    },
    [onUpdateSession, session.id, onClose]
  );

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
      if (session.id) {
        updateSession(value);
      } else {
        createSessions(value);
      }
    },
  });

  const sessionCount = form.useStore(({ values: { startsAt, endsAt, venues } }) =>
    endsAt
      ? (endsAt.startOf('day').diff(startsAt.startOf('day'), 'days').days +
          (endsAt.hour < startsAt.hour ? 0 : 1)) *
        Math.max(venues.length, 1)
      : 0
  );

  const multipleDates =
    !session.startsAt.hasSame(session.endsAt, 'day') || session.endsAt.hour < session.startsAt.hour;

  const formErrorMap = form.useStore((state) => state.errorMap);

  const [isFormValid, isFormDirty] = form.useStore((state) => [state.isFormValid, state.isTouched]);

  const activityType = form.useStore((state) => state.values.activityType);

  const activity = form.useStore((state) => state.values.activity);

  const startsAt = form.useStore((state) => state.values.startsAt);

  const deleteClicked = useCallback(() => {
    confirm({
      title: 'Delete session',
      children: 'Are you sure you want to delete this session?',
      confirm: 'Delete',
    })
      .then(() => {
        onDeleteSession(session.id);
        onClose();
      })
      .catch(() => {});
  }, [session.id, onDeleteSession, onClose, confirm]);

  return (
    <Modal
      className="session-modal"
      title={`${!session.id ? 'New' : 'Edit'} session`}
      onClose={onClose}
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
                  disabled: !!activity && activity.type !== type,
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
                activityType={activityType}
                startsAt={startsAt}
                onAddActivity={onCreateActivity}
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
                      const d = DateTime.fromJSDate(value);
                      const startsAt = field
                        .getValue()
                        .set({ year: d.year, month: d.month, day: d.day });

                      if (session.id || !multipleDates) {
                        const endsAt = form.getFieldValue('endsAt');
                        const newEndDate = startsAt.set({
                          hour: endsAt.hour,
                          minute: endsAt.minute,
                        });
                        form.setFieldValue('endsAt', startsAt.plus({ years: 1 }));
                        field.handleChange(startsAt);
                        form.setFieldValue('endsAt', newEndDate, { touch: true });
                      } else {
                        field.handleChange(startsAt);
                      }
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
                  {venues.map((venue) => (
                    <Checkbox
                      key={venue.id}
                      checked={field.state.value.includes(String(venue.id))}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          field.handleChange([...field.state.value, String(venue.id)]);
                        } else {
                          field.handleChange(
                            field.state.value.filter((v) => v !== String(venue.id))
                          );
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
        <form.Subscribe<ActivityType> selector={(state) => state.values.activityType}>
          {(activityType) => (
            <Collapse in={activityType === ActivityType.Workshop}>
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
            </Collapse>
          )}
        </form.Subscribe>
        <Group className="session-modal__buttons">
          {session.id ? (
            <Button type="button" variant="outline" onClick={deleteClicked}>
              Delete
            </Button>
          ) : (
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          )}
          {session.id ? (
            <Button variant="filled" type="submit" disabled={!isFormValid || !isFormDirty}>
              Save session
            </Button>
          ) : (
            <Button variant="filled" type="submit" disabled={!isFormValid}>
              {`Add ${sessionCount === 1 ? 'session' : `${sessionCount} sessions`}`}
            </Button>
          )}
        </Group>
      </form>
    </Modal>
  );
};
