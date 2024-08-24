import { Progress, ProgressProps } from '@radix-ui/themes';

type SessionProgressProps = ProgressProps & {
  count: number;
  capacity: number;
};

export const SessionProgress: React.FC<SessionProgressProps> = ({ count, capacity, ...props }) => {
  const p = Math.min(100, (100 * count) / capacity);

  const color = p < 75 ? 'amber' : p <= 100 ? 'lime' : 'red';

  return <Progress size="1" variant="soft" value={p} color={color} {...props} />;
};
