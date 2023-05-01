import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';
import { PropsWithVariants } from '@/types/variants';

export enum InputSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const INPUT_VARIANTS = {
  size: {
    values: InputSize,
    defaultValue: InputSize.MEDIUM,
  },
} as const;

export type AllInputVariants = PropsWithVariants<typeof INPUT_VARIANTS>;

export type BaseInputProps = {
  autoSelect?: boolean;
  htmlSize?: number;
};

export type InputProps<C extends ElementType = 'input'> = Polymorphic<
  C,
  BaseInputProps & AllInputVariants
>;

export type InputComponent = WithDisplayName<
  <C extends ElementType = 'input'>(props: InputProps<C>) => ReactElement | null
>;
