import { IconProps, IconSize } from '@/components/atoms/Icon';
import { ActivityType } from '@/graphql/types';
import ActivityIcon from '@/icons/ActivityIcon';
import { WithDisplayName } from '@/types/polymorphic.types';

const ICONS = (
  Object.values(
    import.meta.glob('@/icons/*Icon.tsx', { eager: true, import: 'default' })
  ) as WithDisplayName<React.FC<IconProps>>[]
).reduce(
  (acc, icon) => Object.assign(acc, { [(icon.displayName || 'Icon').replace(/Icon$/, '')]: icon }),
  {}
) as Record<string, React.FC<IconProps>>;

ICONS.Activity = () => <ActivityIcon activityType={ActivityType.Workshop} />;

export const namedIcon = (name: string | undefined, size: IconSize = 'md') => {
  if (!name || !(name in ICONS)) return null;

  const Icon = ICONS[name] as React.FC<IconProps>;
  return <Icon size={size} />;
};

export const icon = {
  options: ['(empty)', ...Object.keys(ICONS)],
  control: {
    type: 'select',
  },
};
