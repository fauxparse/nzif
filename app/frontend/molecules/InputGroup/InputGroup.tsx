import React, {
  Children,
  ElementType,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
  useMemo,
} from 'react';
import clsx from 'clsx';
import { get } from 'lodash-es';

import { AllInputVariants, InputSize } from '../../atoms/Input/Input.types';
import { extractVariants } from '../../types/variants';

import AddOn from './AddOn';
import InputGroupContext from './context';
import Icon from './Icon';
import {
  InputGroupComponent,
  InputGroupIconPosition,
  InputGroupProps,
  InputGroupWithAddon,
} from './InputGroup.types';

import './InputGroup.css';

const useCustomInputGroup = <T extends AllInputVariants>(props: T): T =>
  extractVariants({ size: { values: InputSize, defaultValue: InputSize.MEDIUM } }, props);

const flattenChildren = (children: InputGroupProps['children']): ReactElement[] =>
  Children.toArray(children)
    .filter(isValidElement)
    .flatMap((child) =>
      child.type === Fragment ? flattenChildren(get(child.props, 'children', [])) : child
    );

const InputGroupItself: InputGroupComponent = forwardRef(
  ({ as, className, style = {}, children, ...props }, ref) => {
    const Component = (as || 'fieldset') as ElementType;

    const { size, ...inputGroupProps } = useCustomInputGroup(props);

    const icons = useMemo(
      () =>
        flattenChildren(children).reduce(
          (acc, child) => {
            if (get(child.type, 'displayName') !== 'InputGroup.Icon') return acc;
            const position = (child.props.position || 'start') as InputGroupIconPosition;
            return { ...acc, [position]: acc[position] + 1 };
          },
          { start: 0, end: 0 } as Record<InputGroupIconPosition, number>
        ),
      [children]
    );

    return (
      <InputGroupContext.Provider value={{ size }}>
        <Component
          ref={ref}
          className={clsx('input-group', className)}
          style={{
            ...style,
            '--input-group-start-icons': icons['start'],
            '--input-group-end-icons': icons['end'],
          }}
          {...inputGroupProps}
        >
          {children}
        </Component>
      </InputGroupContext.Provider>
    );
  }
);

InputGroupItself.displayName = 'InputGroup';

export const InputGroup: InputGroupWithAddon = Object.assign(InputGroupItself, {
  AddOn,
  Icon,
});

export default InputGroup;
