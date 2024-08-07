import { Direction } from '@/components/helpers/RouteTransition/types';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import { ResultOf, graphql } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { Badge, Flex, TabNav, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import pluralize from 'pluralize';
import { useMemo } from 'react';

const ActivityCountsQuery = graphql(`
  query ActivityCounts {
    festival {
      id

      activityCounts {
        id
        count
      }
    }
  }
`);

type CountRow = ResultOf<typeof ActivityCountsQuery>['festival']['activityCounts'][number];

type ActivityTypeTabsProps = {
  value: ActivityType;
  onChange: (value: ActivityType | null) => void;
};

const ActivityTypeTabs: React.FC<ActivityTypeTabsProps> = ({ value, onChange }) => {
  const { data } = useQuery(ActivityCountsQuery);

  const counts = useMemo<{ [key in CountRow['id']]?: CountRow['count'] }>(
    () =>
      (data?.festival?.activityCounts || []).reduce(
        (acc, { id, count }) => Object.assign(acc, { [id]: count }),
        {}
      ),
    [data]
  );

  return (
    <TabNav.Root>
      {Object.entries(ACTIVITY_TYPES).map(
        ([key, { label, type, icon: Icon }]) =>
          counts[type] !== undefined &&
          counts[type] > 0 && (
            <TabNav.Link asChild key={key} active={key === value}>
              <Link to="/$activityType" params={{ activityType: type }}>
                <Flex asChild align="center" gap="2">
                  <Text size="3">
                    <Icon />
                    {pluralize(label)}
                    <Badge radius="full">{counts[type]}</Badge>
                  </Text>
                </Flex>
              </Link>
            </TabNav.Link>
          )
      )}
    </TabNav.Root>
  );
};

export const tabSwitchDirection = (
  previous: ActivityType | undefined,
  next: ActivityType
): Direction => {
  if (!previous) return 'left';

  const keys = Object.keys(ACTIVITY_TYPES);
  const previousIndex = keys.indexOf(previous);
  const nextIndex = keys.indexOf(next);

  return previousIndex > nextIndex ? 'right' : 'left';
};

export default ActivityTypeTabs;
