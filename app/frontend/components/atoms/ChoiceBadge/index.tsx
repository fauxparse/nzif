import { Badge, BadgeProps } from '@radix-ui/themes';

import CloseIcon from '@/icons/CloseIcon';
import styles from './ChoiceBadge.module.css';

type ChoiceBadgeProps = BadgeProps & {
  choice: number | null;
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

  if (choice === null) {
    return (
      <Badge className={styles.choiceBadge} color="red" {...props}>
        <CloseIcon size="1" />
      </Badge>
    );
  }

  return (
    <Badge className={styles.choiceBadge} color={color} {...props}>
      {choice}
    </Badge>
  );
};
