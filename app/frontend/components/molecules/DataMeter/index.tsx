import { Box, BoxProps } from '@radix-ui/themes';
import clsx from 'clsx';

import { uniqueId } from 'lodash-es';
import { CSSProperties, useMemo } from 'react';
import classes from './DataMeter.module.css';

type DataMeterProps = BoxProps & {
  min?: number;
  max?: number;
  value: number;
  title: string;
  loading?: boolean;
};

export const DataMeter: React.FC<DataMeterProps> = ({
  className,
  min = 0,
  max = 100,
  value,
  title,
  loading = false,
  ...props
}) => {
  const maskId = useMemo(() => uniqueId('mask-'), []);

  const p = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return (
    <Box className={clsx(className, classes.dataMeter)} {...props}>
      <svg viewBox="0 0 240 140" style={{ '--value': p } as CSSProperties}>
        <title>{title}</title>
        <mask id={maskId}>
          <path
            className={classes.mask}
            d="M20 120 a100 100 0 0 1 200 0"
            stroke="white"
            pathLength="1"
          />
        </mask>
        <path className={classes.track} d="M20 120 a100 100 0 0 1 200 0" pathLength="1" />
        {!loading && (
          <foreignObject x="0" y="0" width="240" height="240" mask={`url(#${maskId})`}>
            <div className={classes.gradient} />
          </foreignObject>
        )}
      </svg>
    </Box>
  );
};
