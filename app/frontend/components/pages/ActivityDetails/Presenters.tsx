import Placename from '@/components/atoms/Placename';
import { Markdown } from '@/components/helpers/Markdown';
import { randParagraph } from '@ngneat/falso';
import { Avatar, Box, Button, Flex, Heading, Skeleton, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import initials from 'initials';
import { useMemo } from 'react';
import { Activity } from './types';

import classes from './ActivityDetails.module.css';

type PresentersProps = {
  activity: Activity;
  loading?: boolean;
};

export const Presenters: React.FC<PresentersProps> = ({ activity, loading }) => {
  const presenters = useMemo(
    () =>
      loading
        ? [
            {
              id: 1,
              name: 'Loading…',
              picture: null,
              bio: '',
              city: null,
            },
          ]
        : activity.presenters,
    [activity.presenters, loading]
  );

  return (
    <Box className={classes.presenters}>
      {presenters.map((presenter) => (
        <Flex gap="5" key={presenter.id}>
          <Skeleton loading={loading}>
            <Avatar
              size="6"
              radius="full"
              src={presenter.picture?.medium}
              alt={presenter.name}
              fallback={initials(presenter.name)}
            />
          </Skeleton>
          <Flex direction="column" align="start" gap="2">
            <Heading as="h3" size="5" my="0">
              <Skeleton loading={loading}>{presenter.name}</Skeleton>
            </Heading>
            {presenter.city && <Placename city={presenter.city} />}
            {loading ? (
              <Text>
                <Skeleton loading>{randParagraph()}</Skeleton>
              </Text>
            ) : (
              <Text asChild size="3">
                <Markdown>{String(presenter.bio)}</Markdown>
              </Text>
            )}
            <Button asChild variant="outline">
              <Link to="/people/$id" params={{ id: String(presenter.id) }}>
                More about {presenter.name}
              </Link>
            </Button>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
};
