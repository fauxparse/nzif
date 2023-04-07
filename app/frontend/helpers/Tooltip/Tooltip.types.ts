import { ElementType, ReactElement, ReactNode, Ref } from 'react';
import { Placement } from '@floating-ui/react';

import { WithDisplayName } from '@/types/polymorphic.types';

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export type TooltipHandle = {
  update: () => void;
};

export type TooltipProps<C extends ElementType> = {
  ref?: Ref<TooltipHandle>;
  placement?: Placement;
  open?: boolean;
  trigger?: TooltipTrigger | TooltipTrigger[];
  content: ReactNode;
  children: ReactElement<C>;
};

export type TooltipComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: TooltipProps<C>) => ReactElement | null
>;
