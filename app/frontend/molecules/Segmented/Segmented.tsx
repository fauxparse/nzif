import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import { isFunction } from 'xstate/lib/utils';

import Button from '@/atoms/Button';

import { SegmentedProps, isExclusive } from './Segmented.types';

import './Segmented.css';

export const Segmented = <T extends string = string>(props: SegmentedProps<T>) => {
  const set = new Set<T>(isExclusive(props) ? [props.value] : props.value);

  const change = (value: T) => {
    if (isExclusive(props)) {
      if (!isEqual(props.value, value)) {
        props.onChange(value);
      }
    } else {
      if (set.has(value)) {
        props.onChange(props.value.filter((o) => o !== value));
      } else {
        props.onChange([...props.value, value]);
      }
    }
  };

  return (
    <div
      className={clsx('segmented', props.className)}
      role="listbox"
      aria-multiselectable={isExclusive(props)}
    >
      {(props.options || []).map((option) => (
        <Button
          key={option.id}
          text={isFunction(option.label) ? option.label(option) : option.label}
          role="option"
          icon={option.icon}
          aria-selected={set.has(option.id)}
          data-id={option.id}
          onClick={() => change(option.id)}
        />
      ))}
    </div>
  );
};

Segmented.displayName = 'Segmented';

export default Segmented;
