import { getActivityIcon } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { BoxProps } from '@mantine/core';

type ActivityIconProps = BoxProps & {
  activityType: ActivityType;
};

export const ActivityIcon: React.FC<ActivityIconProps> = ({ activityType, ...props }) => {
  const Icon = getActivityIcon(activityType);
  return <Icon {...props} />;
};
