import Header from '@/components/organisms/Header';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import CalendarIcon from '@/icons/CalendarIcon';
import EditIcon from '@/icons/EditIcon';
import { useMutation } from '@apollo/client';
import { Badge, Flex, TabNav, Text, Theme } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { pick } from 'lodash-es';
import { useState } from 'react';
import { InPlaceEdit } from './InPlaceEdit';
import { SlugEditor } from './SlugEditor';
import { UpdateActivityDetailsMutation } from './queries';
import { Activity, Session } from './types';

import classes from './ActivityEditor.module.css';

type ActivityEditorHeaderProps = {
  activity: Activity;
  session: Session | null;
  loading?: boolean;
};

export const ActivityEditorHeader: React.FC<ActivityEditorHeaderProps> = ({
  activity,
  session,
  loading = false,
}) => {
  const navigate = useNavigate();

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
    <Theme asChild accentColor={loading ? 'gray' : 'crimson'}>
      <form
        style={{ display: 'contents' }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Header
          className={classes.header}
          title={
            <>
              <form.Field name="name">
                {(field) => (
                  <InPlaceEdit
                    className={classes.headerName}
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
                  <SlugEditor
                    activityType={activity.type}
                    value={field.state.value}
                    busy={busy}
                    onValueChange={field.handleChange}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        field.handleChange(activity.slug);
                      } else {
                        form.handleSubmit();
                      }
                    }}
                  />
                )}
              </form.Field>
            </>
          }
          tabs={
            <TabNav.Root>
              <TabNav.Link asChild key="edit" active={!session}>
                <Link
                  to="/admin/$activityType/$slug"
                  params={{ activityType: activity.type, slug: activity.slug }}
                >
                  <Flex asChild align="center" gap="2">
                    <Text size="3">
                      <EditIcon />
                      Edit
                    </Text>
                  </Flex>
                </Link>
              </TabNav.Link>
              {activity.sessions.map(({ id, startsAt, participants }) => (
                <TabNav.Link asChild key={id} active={id === session?.id}>
                  <Link
                    to="/admin/$activityType/$slug/$session"
                    params={{
                      activityType: activity.type,
                      slug: activity.slug,
                      session: startsAt,
                    }}
                  >
                    <Flex asChild align="center" gap="2">
                      <Text size="3">
                        <CalendarIcon />
                        {startsAt.plus({ hours: 0 }).toFormat('cccc d MMM')}
                        {activity.type === ActivityType.Workshop && (
                          <Badge radius="full">{participants.length}</Badge>
                        )}
                      </Text>
                    </Flex>
                  </Link>
                </TabNav.Link>
              ))}
            </TabNav.Root>
          }
        />
      </form>
    </Theme>
  );
};
