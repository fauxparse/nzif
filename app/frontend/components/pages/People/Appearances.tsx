import { ActivityCard } from '@/components/molecules/ActivityCard';
import { Box, Heading, Section, Skeleton } from '@radix-ui/themes';
import { isEmpty, sortBy } from 'lodash-es';
import { useMemo } from 'react';
import { Appearance } from './types';

import classes from './People.module.css';

type AppearancesProps = {
  loading?: boolean;
  title: string;
  appearances: Appearance[];
};

export const Appearances: React.FC<AppearancesProps> = ({
  loading = false,
  title,
  appearances,
}) => {
  const sorted = useMemo(() => sortBy(appearances, (a) => a.sessions[0].startsAt), [appearances]);

  if (isEmpty(appearances)) {
    return null;
  }

  return (
    <Section py="4">
      <Heading as="h3" size={{ initial: '5', sm: '6' }} mb="3">
        <Skeleton loading={loading}>{title}</Skeleton>
      </Heading>
      <Box className={classes.cards}>
        {sorted.map(({ id, activity, sessions, role }) => (
          <ActivityCard
            key={id}
            loading={loading}
            activity={{ ...activity, presenters: [], sessions }}
          />
        ))}
      </Box>
    </Section>
  );
};
