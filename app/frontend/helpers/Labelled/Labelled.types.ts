import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { FieldErrors } from 'react-hook-form';

export type LabelledProps<T extends string> = ComponentPropsWithoutRef<'label'> & {
  name: T;
  label: ComponentPropsWithoutRef<'label'>['children'];
  required?: boolean;
  hint?: ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny:
  errors?: FieldErrors<{ [key in T]: any }>;
};
