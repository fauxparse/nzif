import { IconProps } from '@/components/atoms/Icon';
import { activityIcon } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';

type ActivityIconProps = IconProps & {
  activityType: ActivityType;
};

const ActivityIcon: React.FC<ActivityIconProps> = ({ activityType, ...props }) => {
  const Icon = activityIcon(activityType);
  return <Icon {...props} />;
};

ActivityIcon.displayName = 'ActivityIcon';

export default ActivityIcon;
