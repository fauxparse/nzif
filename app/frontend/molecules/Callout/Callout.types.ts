import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

export type BaseCalloutProps = {
  //
};

export type CalloutProps<C extends ElementType = 'div'> = Polymorphic<C, BaseCalloutProps>;

export type CalloutComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: CalloutProps<C>) => ReactElement | null
>;
