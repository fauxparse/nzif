import { Activity, ActivityAttributes, ActivitySearchQuery, ActivityType } from '@/graphql/types';

export type ActivityResult = Extract<
  ActivitySearchQuery['search'][number],
  { __typename: 'ActivityResult' }
>;

export type ActivityPickerProps = {
  activityType: ActivityType;
  onSearch: (query: string) => Promise<ActivityResult[]>;
  onCreate: (
    activityType: ActivityType,
    attributes: Partial<ActivityAttributes>
  ) => Promise<Activity>;
};
