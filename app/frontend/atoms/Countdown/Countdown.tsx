import React, { forwardRef, Fragment, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { DateTime } from 'luxon';

import { CountdownProps } from './Countdown.types';
import Digit from './Digit';

import './Countdown.css';

const twoDigits = (n: number): readonly [number, number] => [
  Math.floor(n / 10),
  Math.floor(n) % 10,
];

export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(
  ({ to, title, className, ...props }, ref) => {
    const [diff, setDiff] = React.useState<ReturnType<typeof diffToTarget>>(() => ({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }));

    const diffToTarget = useCallback(() => {
      const now = DateTime.now();
      const target = now > to ? now : to;
      return target.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
    }, [to]);

    useEffect(() => {
      const i = setInterval(() => setDiff(diffToTarget()), 1000);
      return () => clearInterval(i);
    }, [diffToTarget]);

    const groups: readonly (keyof typeof diff)[] = diff.days
      ? (['days', 'hours', 'minutes'] as const)
      : (['hours', 'minutes', 'seconds'] as const);

    return (
      <div
        ref={ref}
        className={clsx('countdown', className)}
        data-layout={groups.join('|')}
        {...props}
      >
        {title && <h2 className="countdown__title">{title}</h2>}
        {groups.map((group) => (
          <Fragment key={group}>
            {(group === 'minutes' || group === 'seconds') && (
              <i className="countdown__separator">:</i>
            )}
            {twoDigits(diff[group] || 0).map((d, i) => (
              <Digit key={i} digit={d} />
            ))}
            <span className="countdown__unit">{group}</span>
          </Fragment>
        ))}
      </div>
    );
  }
);

Countdown.displayName = 'Countdown';

export default Countdown;
