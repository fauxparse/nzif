import { Direction } from '@/components/helpers/RouteTransition/types';
import { ACTIVITY_TYPES, PluralActivityType } from '@/constants/activityTypes';
import { Tabs } from '@/components/molecules/Tabs';
import { graphql, ResultOf } from '@/graphql';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { ActivityType } from '@/graphql/types';
import Badge from '@/components/atoms/Badge';

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
  value: PluralActivityType;
  onChange: (value: PluralActivityType | null) => void;
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
    <Tabs value={value} onChange={(value) => onChange(value as PluralActivityType | null)}>
      <Tabs.List>
        {Object.entries(ACTIVITY_TYPES).map(([key, { label, type, icon: Icon }]) => (
          <Tabs.Tab
            key={key}
            value={key}
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
  previous: PluralActivityType | undefined,
  next: PluralActivityType
): Direction => {
  if (!previous) return 'left';

  const keys = Object.keys(ACTIVITY_TYPES);
  const previousIndex = keys.indexOf(previous);
  const nextIndex = keys.indexOf(next);

  return previousIndex > nextIndex ? 'right' : 'left';
};

export default ActivityTypeTabs;
