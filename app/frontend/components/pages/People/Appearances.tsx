import { Badge, Button, Card, Image, Stack, Text, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { isEmpty, sortBy } from 'lodash-es';
import { useMemo } from 'react';
import { formatSessionTime } from '../../../util/formatSessionTime';
import { Appearance } from './types';

type AppearancesProps = {
  title: string;
  appearances: Appearance[];
};

export const Appearances: React.FC<AppearancesProps> = ({ title, appearances }) => {
  const sorted = useMemo(() => sortBy(appearances, (a) => a.sessions[0].startsAt), [appearances]);

  if (isEmpty(appearances)) {
    return null;
  }

  return (
    <>
      <Title order={3}>{title}</Title>
      {sorted.map(({ id, activity, sessions, role }) => (
        <Card key={id} className="person__appearance" withBorder shadow="sm" radius="md">
          {activity.picture && (
            <Card.Section
              component={Link}
              to="/$activityType/$slug"
              params={{ activityType: activity.type, slug: activity.slug }}
            >
              <Image src={activity.picture.medium} alt={activity.name} />
              <Badge
                variant="outline"
                data-color="primary"
                pos="absolute"
                top="0.5rem"
                left="0.5rem"
                radius="sm"
              >
                {role}
              </Badge>
            </Card.Section>
          )}

          <Stack justify="start" my="sm" flex={1} gap="sm">
            <Text fw={500} size="lg" lh="lg" mb={0} flex={1} lineClamp={3}>
              {activity.name}
            </Text>
            {sessions.map(({ id, startsAt, endsAt, venue }) => (
              <Text key={id} mb={0}>
                {formatSessionTime({ startsAt, endsAt })}
                <br />
                {startsAt.plus({ days: 0 }).toFormat('EEEE d MMMM')}
              </Text>
            ))}
          </Stack>

          <Button
            component={Link}
            to="/$activityType/$slug"
            params={{ activityType: activity.type, slug: activity.slug }}
            size="sm"
          >
            More information
          </Button>
        </Card>
      ))}
    </>
  );
};
