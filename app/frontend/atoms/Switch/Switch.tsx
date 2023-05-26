import { forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import clsx from 'clsx';

import { extractVariants } from '@/types/variants';

import { Orientation, SWITCH_VARIANTS, SwitchProps } from './Switch.types';

// import useDragInteraction from './useDragInteraction';
import './Switch.css';

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, indeterminate, ...props }, ref) => {
    const ownRef = useRef<HTMLInputElement>(null);

    const { orientation = Orientation.HORIZONTAL, ...switchProps } = extractVariants(
      SWITCH_VARIANTS,
      props
    );

    // useDragInteraction(ownRef);

    useEffect(() => {
      if (ownRef.current && indeterminate !== undefined) {
        ownRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <input
        ref={mergeRefs([ref, ownRef])}
        type="checkbox"
        role="switch"
        className={clsx('switch', className)}
        data-orientation={orientation}
        {...switchProps}
      />
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
