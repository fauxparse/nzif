import { ElementType, ReactElement } from 'react';

import Button from '@/atoms/Button';
import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type BaseSelectProps<V = string, T extends SelectOption<V> = SelectOption<V>> = {
  options: T[];
  value: V | undefined;
  placeholder?: string;
  onChange: (value: V) => void;
};

export type SelectProps<
  V = string,
  T extends SelectOption<V> = SelectOption<V>,
  C extends ElementType = 'div'
> = Polymorphic<C, BaseSelectProps<V, T>>;

export type SelectComponent<
  V = string,
  T extends SelectOption<V> = SelectOption<V>,
  C extends ElementType = typeof Button
> = WithDisplayName<(props: SelectProps<V, T, C>) => ReactElement | null>;
