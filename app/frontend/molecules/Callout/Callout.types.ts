import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';

// biome-ignore lint/complexity/noBannedTypes: we might want to extend this type in the future
export type BaseCalloutProps = {
  //
};

export type CalloutProps<C extends ElementType = 'div'> = Polymorphic<C, BaseCalloutProps>;

export type CalloutComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: CalloutProps<C>) => ReactElement | null
>;
