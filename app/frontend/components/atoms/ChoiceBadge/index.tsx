import { Badge, BadgeProps } from '@radix-ui/themes';

import CloseIcon from '@/icons/CloseIcon';
import DotIcon from '@/icons/DotIcon';
import { forwardRef } from 'react';
import styles from './ChoiceBadge.module.css';

type ChoiceBadgeProps = BadgeProps & {
  choice: number | null;
  size?: 'full' | 'dot';
};

const COLORS: Record<number, BadgeProps['color']> = {
  1: 'lime',
  2: 'yellow',
  3: 'amber',
  4: 'orange',
  5: 'red',
};

export const ChoiceBadge = forwardRef<HTMLSpanElement, ChoiceBadgeProps>(
  ({ choice, size = 'full', ...props }, ref) => {
    const color = choice === null ? 'red' : COLORS[choice as keyof typeof COLORS] ?? 'gray';

    return (
      <Badge ref={ref} className={styles.choiceBadge} data-size={size} color={color} {...props}>
        {choice === null ? <CloseIcon size="1" /> : size === 'dot' ? <DotIcon size="1" /> : choice}
      </Badge>
    );
  }
);
