import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { extractVariants } from '../../types/variants';

import { AllSpinnerVariants, SPINNER_VARIANTS, SpinnerProps } from './Spinner.types';

import './Spinner.css';

const useCustomSpinner = <T extends AllSpinnerVariants>(props: T): T =>
  extractVariants(SPINNER_VARIANTS, props);

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({ className, ...props }, ref) => {
  const { size, ...spinnerProps } = useCustomSpinner(props);
  return (
    <div ref={ref} className={clsx('spinner', className)} data-size={size} {...spinnerProps} />
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
