import { Badge, BadgeProps } from '@radix-ui/themes';

type ChoiceBadgeProps = BadgeProps & {
  choice: number;
};

const COLORS: Record<number, BadgeProps['color']> = {
  1: 'lime',
  2: 'yellow',
  3: 'amber',
  4: 'orange',
  5: 'red',
};

export const ChoiceBadge: React.FC<ChoiceBadgeProps> = ({ choice, ...props }) => {
  const color = COLORS[choice as keyof typeof COLORS] ?? 'gray';
  return (
    <Badge color={color} {...props}>
      {choice}
    </Badge>
  );
};
