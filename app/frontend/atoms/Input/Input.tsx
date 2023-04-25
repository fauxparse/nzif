import React, { ElementType, forwardRef, useContext } from 'react';
import clsx from 'clsx';
import { set } from 'lodash-es';

import { InputGroupContext } from '@/molecules/InputGroup';
import { extractVariants } from '@/types/variants';

import { AllInputVariants, INPUT_VARIANTS, InputComponent, InputSize } from './Input.types';

import './Input.css';

const useCustomInput = <T extends AllInputVariants>(props: T, defaultSize: InputSize): T =>
  extractVariants(set(INPUT_VARIANTS, 'size.defaultValue', defaultSize), props);

const Input: InputComponent = forwardRef(
  ({ as, className, iconBefore, iconAfter, autoSelect, onFocus, ...props }, ref) => {
    const Component = (as || 'input') as ElementType;

    const { size: inputGroupSize } = useContext(InputGroupContext);

    const { size, ...inputProps } = useCustomInput(props, inputGroupSize || InputSize.MEDIUM);

    const focus = (e: React.FocusEvent) => {
      if (autoSelect) {
        (e.target as HTMLInputElement).select();
      }
      if (onFocus) {
        onFocus(e);
      }
    };

    return (
      <Component
        ref={ref}
        className={clsx('input', className)}
        data-size={size}
        onFocus={focus}
        {...inputProps}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
