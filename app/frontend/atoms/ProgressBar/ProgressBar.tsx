import { forwardRef } from 'react';
import clsx from 'clsx';

import { ProgressBarProps } from './ProgressBar.types';

import './ProgressBar.css';

export const ProgressBar = forwardRef<HTMLProgressElement, ProgressBarProps>(
  ({ className, ...props }, ref) => {
    return <progress ref={ref} className={clsx('progress-bar', className)} {...props} />;
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
