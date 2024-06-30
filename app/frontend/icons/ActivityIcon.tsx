import { activityIcon } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { BoxProps } from '@mantine/core';

type ActivityIconProps = BoxProps & {
  activityType: ActivityType;
};

const ActivityIcon: React.FC<ActivityIconProps> = ({ activityType, ...props }) => {
  const Icon = activityIcon(activityType);
  return <Icon {...props} />;
};

ActivityIcon.displayName = 'ActivityIcon';

export default ActivityIcon;
