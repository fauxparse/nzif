import { ComponentPropsWithoutRef } from 'react';
import { FieldError } from 'react-hook-form';

export type FormErrorProps<T extends string> = ComponentPropsWithoutRef<'div'> & {
  errors: { [key in T]?: FieldError };
  field: T;
};
