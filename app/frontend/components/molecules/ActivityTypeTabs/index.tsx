import { ACTIVITY_TYPES, PluralActivityType } from '@/constants/activityTypes';
import { Tabs } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

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

export default ActivityTypeTabs;
