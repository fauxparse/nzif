import React from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';

import { FormErrorProps } from './FormError.types';

import './FormError.css';

export const FormError = <T extends string>({
  errors,
  field,
  className,
  ...props
}: FormErrorProps<T>) =>
  errors[field]?.message ? (
    <div className={clsx('form-error', className)} {...props}>
      {errors[field]?.message}
    </div>
  ) : null;

FormError.displayName = 'FormError';

export default FormError;
