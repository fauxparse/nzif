import { ComponentPropsWithoutRef } from 'react';

export type DialogProps = ComponentPropsWithoutRef<'div'> & {
  open: boolean;
  modal?: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestClose?: () => Promise<boolean>;
};
