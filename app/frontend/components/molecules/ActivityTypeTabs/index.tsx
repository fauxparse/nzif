import Badge from '@/components/atoms/Badge';
import { Direction } from '@/components/helpers/RouteTransition/types';
import { Tabs } from '@/components/molecules/Tabs';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import { ResultOf, graphql } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import { useQuery } from '@apollo/client';
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
  const { loading, data } = useQuery(ActivityCountsQuery);

  const counts = useMemo<{ [key in CountRow['id']]?: CountRow['count'] }>(
    () =>
      (data?.festival?.activityCounts || []).reduce(
        (acc, { id, count }) => Object.assign(acc, { [id]: count }),
        {}
      ),
    []
  );

  return (
    <Tabs value={value} onChange={(value) => onChange(value as ActivityType | null)}>
      <Tabs.List>
        {Object.entries(ACTIVITY_TYPES).map(([key, { label, type, icon: Icon }]) => (
          <Tabs.Tab
            key={key}
            value={type}
            leftSection={<Icon />}
            rightSection={
              counts[type] && (
                <Badge variant="light" circle>
                  {counts[type]}
                </Badge>
              )
            }
          >
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
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
