import React, { forwardRef } from 'react';
import clsx from 'clsx';

import Icon from '../Icon';

import { RadioProps } from './Radio.types';

import './Radio.css';

const RadioIcon = () => (
  <Icon>
    <circle cx={12} cy={12} r={10} />
    <path d="M12 7a5 5 0 0 1 0 10a5 5 0 0 1 0-10" />
  </Icon>
);

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, type = 'radio', preference, disabled, children = <RadioIcon />, ...props },
    ref
  ) => (
    <span
      className={clsx(type === 'radio' && 'radio', className)}
      data-preference={preference || undefined}
      data-disabled={disabled || undefined}
    >
      <input type={type} ref={ref} disabled={disabled || undefined} {...props} />
      {children}
    </span>
  )
);

Radio.displayName = 'Radio';

export default Radio;
