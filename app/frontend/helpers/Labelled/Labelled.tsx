import clsx from 'clsx';
import { Ref, forwardRef } from 'react';

import { LabelledProps } from './Labelled.types';

import './Labelled.css';

export const Labelled = forwardRef(
  <T extends string>(
    {
      className,
      label,
      hint,
      name,
      required = false,
      errors = {},
      children,
      ...props
    }: LabelledProps<T>,
    ref: Ref<HTMLLabelElement>
  ) => {
    const error = errors[name];

    return (
      <div
        className={clsx('labelled', className)}
        data-name={name}
        data-required={required || undefined}
        data-errors={!!error || undefined}
      >
        <label ref={ref} className="labelled__label" htmlFor={name} {...props}>
          {label}
        </label>
        <div className="labelled__field">{children}</div>
        {error?.message ? (
          <p className="labelled__error">{error.message as string}</p>
        ) : hint ? (
          <p className="labelled__hint">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Labelled.displayName = 'Labelled';

export default Labelled;
