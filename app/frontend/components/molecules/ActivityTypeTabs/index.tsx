import { Direction } from '@/components/helpers/RouteTransition/types';
import { ACTIVITY_TYPES, PluralActivityType } from '@/constants/activityTypes';
import { Tabs } from '@/components/molecules/Tabs';

type ActivityTypeTabsProps = {
  value: PluralActivityType;
  onChange: (value: PluralActivityType | null) => void;
};

const ActivityTypeTabs: React.FC<ActivityTypeTabsProps> = ({ value, onChange }) => (
  <Tabs value={value} onChange={(value) => onChange(value as PluralActivityType | null)}>
    <Tabs.List>
      {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
        <Tabs.Tab key={key} value={key}>
          {label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  </Tabs>
);

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
