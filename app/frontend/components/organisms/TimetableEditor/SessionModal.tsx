import { Checkbox } from '@/components/atoms/Checkbox';
import { NumberInput } from '@/components/atoms/NumberInput';
import { TimeInput } from '@/components/atoms/TimeInput';
import { Collapsible } from '@/components/helpers/Collapsible';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import {
  ActivityAttributes,
  ActivityType,
  MultipleSessionAttributes,
  SessionAttributes,
} from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import CloseIcon from '@/icons/CloseIcon';
import LocationIcon from '@/icons/LocationIcon';
import { FetchResult } from '@apollo/client';
import { DialogProps } from '@radix-ui/react-dialog';
import {
  Box,
  Button,
  Callout,
  Dialog,
  Flex,
  Grid,
  SegmentedControl,
  Select,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfirmation } from '../ConfirmationModal';
import { ActivityPicker } from './ActivityPicker';
import { CreateSessionsMutation, DestroySessionMutation, UpdateSessionMutation } from './queries';
import { Activity, Session } from './types';

import CalendarIcon from '@/icons/CalendarIcon';
import WarningIcon from '@/icons/WarningIcon';
import clsx from 'clsx';
import { ActivityPresenters } from './ActivityPresenters';
import classes from './SessionModal.module.css';

type SessionModalProps = DialogProps & {
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

export const SessionModal: React.FC<SessionModalProps> = ({
  session: initial,
  venues,
  onCreateSessions,
  onCreateActivity,
  onUpdateSession,
  onDeleteSession,
  onOpenChange,
  ...props
}) => {
  const [session, setSession] = useState(initial);

  const festival = useFestival();

  const { confirm } = useConfirmation();

  useEffect(() => {
    if (initial) setSession(initial);
  }, [initial]);

  const onClose = () => onOpenChange?.(false);

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

  const form = useForm({
    defaultValues: {
      ...session,
      venues: session.venue ? [String(session.venue.id)] : [],
    } as SessionWithMultipleVenues,
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
    <Dialog.Root onOpenChange={onOpenChange} {...props}>
      <Dialog.Content>
        <Dialog.Title>{session.id ? 'Edit session' : 'Add session'}</Dialog.Title>
        <VisuallyHidden>
          <Dialog.Description>Session details</Dialog.Description>
        </VisuallyHidden>
        <Box asChild className={classes.close}>
          <Dialog.Close>
            <CloseIcon />
          </Dialog.Close>
        </Box>
        <Grid asChild gap="4" className={classes.form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="activityType">
              {(field) => (
                <SegmentedControl.Root
                  className={classes.full}
                  size="3"
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as ActivityType)}
                  style={{ pointerEvents: session.activity ? 'none' : 'auto' }}
                >
                  {Object.values(ACTIVITY_TYPES).map(({ type, label }) => (
                    <SegmentedControl.Item key={type} value={type}>
                      {label}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl.Root>
              )}
            </form.Field>

            <Collapsible
              className={classes.full}
              open={sessionCount === 1 && !formErrorMap.onChange}
            >
              <Flex direction="column" gap="4">
                <form.Subscribe<ActivityType> selector={(state) => state.values.activityType}>
                  {(activityType) => (
                    <form.Field name="activity">
                      {(field) => (
                        <ActivityPicker
                          value={field.state.value}
                          activityType={activityType}
                          startsAt={startsAt}
                          onAddActivity={onCreateActivity}
                          onChange={(activity) => {
                            field.handleChange(activity);

                            if (activity) {
                              field.form.setFieldValue('activityType', activity.type);
                            }
                          }}
                        />
                      )}
                    </form.Field>
                  )}
                </form.Subscribe>
                {activity && <ActivityPresenters activity={activity} />}
              </Flex>
            </Collapsible>

            <Collapsible open={!!formErrorMap.onChange} gridColumn="1 / -1">
              <Callout.Root>
                <Callout.Icon>
                  <WarningIcon />
                </Callout.Icon>
                <Callout.Text>{formErrorMap.onChange}</Callout.Text>
              </Callout.Root>
            </Collapsible>

            <div className={classes.dateAndTime}>
              <div className={classes.date}>
                <form.Field name="startsAt">
                  {(field) => (
                    <DatePicker
                      value={field.state.value}
                      onChange={(value) => {
                        if (value) {
                          const startsAt = field
                            .getValue()
                            .set({ year: value.year, month: value.month, day: value.day });

                          if (session.id || !multipleDates) {
                            const endsAt = form.getFieldValue('endsAt');
                            const newEndDate = startsAt.set({
                              hour: endsAt.hour,
                              minute: endsAt.minute,
                            });
                            form.setFieldValue('endsAt', startsAt.plus({ years: 1 }));
                            field.handleChange(startsAt);
                            form.setFieldValue('endsAt', newEndDate);
                          } else {
                            field.handleChange(startsAt);
                          }
                        }
                      }}
                    />
                  )}
                </form.Field>
                {!!session && multipleDates && (
                  <>
                    <Text>to</Text>
                    <form.Field name="endsAt">
                      {(field) => (
                        <DatePicker
                          value={field.state.value}
                          onChange={(value) => {
                            if (value) {
                              field.handleChange(
                                field
                                  .getValue()
                                  .set({ year: value.year, month: value.month, day: value.day })
                              );
                            }
                          }}
                        />
                      )}
                    </form.Field>
                  </>
                )}
              </div>
              <div className={classes.time}>
                <form.Field name="startsAt">
                  {(field) => (
                    <TimeInput
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) {
                          const { hour, minute } = value;
                          field.handleChange(field.getValue().set({ hour, minute }));
                        }
                      }}
                    />
                  )}
                </form.Field>
                <Text>to</Text>
                <form.Field name="endsAt">
                  {(field) => (
                    <TimeInput
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) {
                          const { hour, minute } = value;
                          field.handleChange(field.getValue().set({ hour, minute }));
                        }
                      }}
                    />
                  )}
                </form.Field>
              </div>
            </div>

            {session.id ? (
              <form.Field name="venue">
                {(field) => (
                  <Select.Root
                    size="3"
                    value={field.state.value?.id}
                    onValueChange={(id) =>
                      field.handleChange(venues.find((v) => String(v.id) === id) || null)
                    }
                  >
                    <Select.Trigger className={clsx(classes.full, classes.trigger)}>
                      <Flex align="center" gap="3">
                        <LocationIcon />
                        {field.state.value?.room || field.state.value?.building || 'Select venue'}
                      </Flex>
                    </Select.Trigger>
                    <Select.Content>
                      {venues.map((v) => (
                        <Select.Item key={v.id} value={String(v.id)}>
                          {v.room || v.building}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              </form.Field>
            ) : (
              <form.Field name="venues">
                {(field) => (
                  <Box className={classes.full}>
                    {venues.map((venue) => (
                      <Flex asChild align="center" gap="2" key={venue.id}>
                        <label>
                          <Checkbox
                            checked={field.state.value.includes(String(venue.id))}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.handleChange([...field.state.value, String(venue.id)]);
                              } else {
                                field.handleChange(
                                  field.state.value.filter((v) => v !== String(venue.id))
                                );
                              }
                            }}
                          />
                          <Text>{venue.room || venue.building}</Text>
                        </label>
                      </Flex>
                    ))}
                  </Box>
                )}
              </form.Field>
            )}
            <form.Subscribe<ActivityType> selector={(state) => state.values.activityType}>
              {(activityType) => (
                <Collapsible className={classes.full} open={activityType === ActivityType.Workshop}>
                  <form.Field name="capacity">
                    {(field) => (
                      <Flex align="center" gap="2">
                        <NumberInput
                          className={classes.number}
                          size="3"
                          value={field.state.value ?? null}
                          min={0}
                          max={100}
                          onValueChange={(value: number | null) => {
                            if (!value && value !== 0) {
                              field.handleChange(null);
                            } else {
                              field.handleChange(value);
                            }
                          }}
                        />
                        <Text>participants max</Text>
                      </Flex>
                    )}
                  </form.Field>
                </Collapsible>
              )}
            </form.Subscribe>
            <Flex className={classes.buttons} gap="4" justify="end" align="center">
              {session.id ? (
                <Button type="button" size="3" variant="outline" onClick={deleteClicked}>
                  Delete
                </Button>
              ) : (
                <Button type="button" size="3" onClick={onClose}>
                  Cancel
                </Button>
              )}
              {session.id ? (
                <Button
                  variant="solid"
                  size="3"
                  type="submit"
                  disabled={!isFormValid || !isFormDirty}
                >
                  Save session
                </Button>
              ) : (
                <Button variant="solid" size="3" type="submit" disabled={!isFormValid}>
                  {`Add ${sessionCount === 1 ? 'session' : `${sessionCount} sessions`}`}
                </Button>
              )}
            </Flex>
          </form>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type DatePickerProps = {
  value: DateTime | null;
  onChange: (value: DateTime) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const { startDate, endDate } = useFestival();
  const dates = useMemo(
    () => range(endDate.diff(startDate, 'days').days + 1).map((days) => startDate.plus({ days })),
    [startDate, endDate]
  );

  const valueChange = (date: string) => {
    const newValue = DateTime.fromISO(date) || null;
    onChange(newValue);
  };

  return (
    <Select.Root size="3" value={value?.toISODate() || undefined} onValueChange={valueChange}>
      <Select.Trigger className={classes.trigger}>
        <Flex align="center" gap="3">
          <CalendarIcon />
          {value?.plus({ seconds: 0 }).toFormat('cccc, d MMMM') || ''}
        </Flex>
      </Select.Trigger>
      <Select.Content>
        {dates.map((date) => (
          <Select.Item key={date.toISODate()} value={date.toISODate() || ''}>
            {date.toFormat('cccc, d MMMM')}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
