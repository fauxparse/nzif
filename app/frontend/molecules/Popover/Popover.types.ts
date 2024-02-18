import { Placement } from '@floating-ui/react';
import { ComponentPropsWithoutRef, MutableRefObject } from 'react';

export type PopoverProps = ComponentPropsWithoutRef<'div'> & {
  reference: HTMLElement;
  open: boolean;
  placement?: Placement;
  offset?: number | { mainAxis?: number; crossAxis?: number; alignmentAxis?: number | null };
  initialFocus?: number | MutableRefObject<HTMLElement | null>;
  onOpenChange: (open: boolean) => void;
};
