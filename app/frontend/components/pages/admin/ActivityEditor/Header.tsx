import { Tabs } from '@/components/molecules/Tabs';
import Header from '@/components/organisms/Header';
import { pluralFromActivityType } from '@/constants/activityTypes';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import CalendarIcon from '@/icons/CalendarIcon';
import EditIcon from '@/icons/EditIcon';
import LinkIcon from '@/icons/LinkIcon';
import { useMutation } from '@apollo/client';
import { ActionIcon, Badge, Group, Loader, Text, TextInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { InPlaceEdit } from './InPlaceEdit';
import { UpdateActivityDetailsMutation } from './queries';
import { Activity, Session } from './types';

type ActivityEditorHeaderProps = {
  activity: Activity;
  session: Session | null;
  loading?: boolean;
};

type HeaderDetails = Pick<Activity, 'name' | 'slug'>;

export const ActivityEditorHeader: React.FC<ActivityEditorHeaderProps> = ({
  activity,
  session,
  loading = false,
}) => {
  const navigate = useNavigate();

  const tabValue = session?.startsAt?.toISODate() ?? 'edit';

  const [updateMutation] = useMutation(UpdateActivityDetailsMutation);

  const [busy, setBusy] = useState(false);

  const form = useForm({
    defaultValues: activity,
    onSubmit: ({ value }) => {
      setBusy(true);
      updateMutation({
        variables: {
          id: activity.id,
          attributes: pick(value, ['name', 'slug']) as ActivityAttributes,
        },
        update: (cache, { data }) => {
          if (!data?.updateActivity?.activity) return;

          const updated = data.updateActivity.activity;

          cache.modify({
            id: cache.identify(activity),
            fields: {
              name: () => updated.name,
              slug: () => updated.slug,
            },
          });

          if (updated.slug !== activity.slug) {
            navigate({
              to: '/admin/$activityType/$slug',
              params: {
                activityType: updated.type,
                slug: updated.slug,
              },
              replace: true,
            });
          }
        },
      }).finally(() => setBusy(false));
    },
  });

  return (
    <form
      style={{ display: 'contents' }}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Header
        className="activity-editor__header"
        data-color={loading ? 'neutral' : 'magenta'}
        title={
          <>
            <form.Field name="name">
              {(field) => (
                <InPlaceEdit
                  className="activity-editor__header__name"
                  autosize
                  minRows={1}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      field.handleChange(activity.name);
                    } else {
                      form.handleSubmit();
                    }
                  }}
                />
              )}
            </form.Field>
            <form.Field name="slug">
              {(field) => (
                <Group className="activity-editor__header__url" gap="0">
                  <Text fz="sm">
                    {`https://my.improvfest.nz/${pluralFromActivityType(activity.type)}/`}
                  </Text>

                  <TextInput
                    rightSection={<Loader size="xs" opacity={busy ? 1 : 0} />}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.currentTarget.value)}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        field.handleChange(activity.slug);
                      } else {
                        form.handleSubmit();
                      }
                    }}
                  />
                  <ActionIcon
                    type="button"
                    variant="subtle"
                    aria-label="Copy"
                    onClick={() => {
                      //
                    }}
                  >
                    <LinkIcon />
                  </ActionIcon>
                </Group>
              )}
            </form.Field>
          </>
        }
        tabs={
          <Tabs
            value={tabValue}
            onChange={(value) => {
              if (!value) return;
              navigate({
                to: '/admin/$activityType/$slug/$session',
                params: {
                  activityType: activity.type,
                  slug: activity.slug,
                  session: DateTime.fromISO(value),
                },
              });
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="edit" leftSection={<EditIcon />}>
                Edit
              </Tabs.Tab>
              {activity.sessions.map((session) => (
                <Tabs.Tab
                  key={session.id}
                  value={session.startsAt.toISODate() ?? ''}
                  leftSection={<CalendarIcon />}
                  rightSection={
                    activity.type === ActivityType.Workshop && (
                      <Badge circle size="lg">
                        {session.participants.length}
                      </Badge>
                    )
                  }
                >
                  {session.startsAt.plus({ hours: 0 }).toFormat('cccc d MMM')}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        }
      />
    </form>
  );
};
