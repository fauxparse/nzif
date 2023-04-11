import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '../../types/polymorphic.types';

export type BaseEditableFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  errors?: {
    [key: string]: string[];
  };
};

export type EditableFieldProps<C extends ElementType = 'input'> = Polymorphic<
  C,
  BaseEditableFieldProps
>;

export type EditableFieldComponent = WithDisplayName<
  <C extends ElementType = 'input'>(props: EditableFieldProps<C>) => ReactElement | null
>;
