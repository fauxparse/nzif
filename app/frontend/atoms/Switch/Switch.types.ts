import { ComponentPropsWithoutRef } from 'react';

import { UnwantedInputProps } from '../Radio/Radio.types';
import { PropsWithVariants } from '@/types/variants';

export enum Orientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export const SWITCH_VARIANTS = {
  orientation: {
    values: Orientation,
    defaultValue: Orientation.HORIZONTAL,
  },
};

export type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, UnwantedInputProps | 'type'> &
  PropsWithVariants<typeof SWITCH_VARIANTS> & {
    indeterminate?: boolean;
  };
