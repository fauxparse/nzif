import { Combobox } from '@/components/molecules/Combobox';
import { activityColor } from '@/constants/activityTypes';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import ActivityIcon from '@/icons/ActivityIcon';
import CloseIcon from '@/icons/CloseIcon';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Card, Flex, IconButton, Inset, Text, Theme } from '@radix-ui/themes';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { ActivitySearchQuery, CreateActivityMutation } from './queries';
import { Activity } from './types';

import EditIcon from '@/icons/EditIcon';
import { Link } from '@tanstack/react-router';
import classes from './ActivityPicker.module.css';

type ActivityPickerProps = {
  value: Activity | null;
  startsAt?: DateTime;
  placeholder?: string;
  activityType: ActivityType;
  onAddActivity?: (
    type: ActivityType,
    attributes: Partial<ActivityAttributes>
  ) => Promise<Activity>;
  onChange: (value: Activity | null) => void;
};

type Item = {
  id: Activity['id'];
  label: string;
  activity: Activity;
};

export const ActivityPicker: React.FC<ActivityPickerProps> = ({
  value,
  activityType,
  startsAt,
  placeholder,
  onAddActivity,
  onChange,
}) => {
  const [search] = useLazyQuery(ActivitySearchQuery);

  const handleSearch = useCallback(
    (query: string) =>
      new Promise<Item[]>((resolve) => {
        search({ variables: { query, activityType } }).then(({ data }) => {
          if (data?.search) {
            resolve(
              data.search.flatMap((result) =>
                result.__typename === 'ActivityResult'
                  ? [
                      {
                        id: result.activity.id,
                        label: result.activity.name,
                        activity: result.activity,
                      },
                    ]
                  : []
              )
            );
          }
        });
      }),
    [activityType, search]
  );

  const [create] = useMutation(CreateActivityMutation);

  const handleCreate = useCallback(
    (query: string) =>
      new Promise<Item>((resolve) => {
        if (!onAddActivity) return;

        create({ variables: { type: activityType, attributes: { name: query } } }).then(
          ({ data }) => {
            if (!data?.createActivity?.activity) return;

            const { activity } = data.createActivity;

            resolve({
              id: activity.id,
              label: activity.name,
              activity,
            });
          }
        );
      }),
    [activityType, create, onAddActivity]
  );

  return (
    <Combobox.Root
      className={classes.root}
      value={value}
      items={handleSearch}
      icon={<ActivityIcon activityType={activityType} />}
      placeholder={placeholder || 'Activity'}
      enableAdd={!!onAddActivity}
      onSelect={(item) => onChange(item?.activity || null)}
      onAdd={handleCreate}
      input={(props) =>
        value ? (
          <Theme accentColor={activityColor(activityType)} asChild>
            <Inset style={{ flex: 1 }}>
              <Card className={classes.card} size="1">
                <Flex gap="3" align="center">
                  <ActivityIcon activityType={activityType} />
                  <Box flexGrow="1" asChild>
                    <Text>{value.name}</Text>
                  </Box>
                  <IconButton
                    asChild
                    className={classes.activityIconButton}
                    variant="ghost"
                    size="2"
                    radius="full"
                  >
                    <Link
                      to="/admin/$activityType/$slug"
                      params={{ activityType: value.type, slug: value.slug }}
                    >
                      <EditIcon />
                    </Link>
                  </IconButton>
                  <IconButton
                    className={classes.activityIconButton}
                    variant="ghost"
                    size="2"
                    radius="full"
                    onClick={() => onChange(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Flex>
              </Card>
            </Inset>
          </Theme>
        ) : (
          <Combobox.Input {...props} />
        )
      }
    />
  );
};
