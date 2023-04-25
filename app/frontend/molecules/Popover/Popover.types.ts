import { ComponentPropsWithoutRef } from 'react';

export type PopoverProps = ComponentPropsWithoutRef<'div'> & {
  reference: HTMLElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
