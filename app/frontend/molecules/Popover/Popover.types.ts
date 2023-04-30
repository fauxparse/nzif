import { ComponentPropsWithoutRef } from 'react';
import { Placement } from '@floating-ui/react';

export type PopoverProps = ComponentPropsWithoutRef<'div'> & {
  reference: HTMLElement;
  open: boolean;
  placement?: Placement;
  offset?: number | { mainAxis?: number; crossAxis?: number; alignmentAxis?: number | null };
  onOpenChange: (open: boolean) => void;
};
