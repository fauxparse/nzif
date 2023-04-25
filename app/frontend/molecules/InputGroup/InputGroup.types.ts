import { ElementType, ReactElement } from 'react';

import { AllInputVariants } from '@/atoms/Input/Input.types';
import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type InputGroupProps<C extends ElementType = 'fieldset'> = Polymorphic<C, AllInputVariants>;

export type AddOnProps<C extends ElementType = 'fieldset'> = Polymorphic<C, AllInputVariants>;

export type AddOnComponent = WithDisplayName<
  <C extends ElementType = 'fieldset'>(props: AddOnProps<C>) => ReactElement | null
>;

export type InputGroupComponent = WithDisplayName<
  <C extends ElementType = 'fieldset'>(props: InputGroupProps<C>) => ReactElement | null
>;

export type InputGroupIconPosition = 'start' | 'end';
