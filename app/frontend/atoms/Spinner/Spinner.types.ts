import { ComponentPropsWithoutRef } from 'react';

import { PropsWithVariants } from '../../types/variants';

export enum SpinnerSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const SPINNER_VARIANTS = {
  size: {
    values: SpinnerSize,
    defaultValue: SpinnerSize.SMALL,
  },
} as const;

export type AllSpinnerVariants = PropsWithVariants<typeof SPINNER_VARIANTS>;

export type SpinnerProps = ComponentPropsWithoutRef<'div'> & AllSpinnerVariants;
