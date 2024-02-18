import clsx from 'clsx';
import React from 'react';

import Button, { ButtonProps } from '@/atoms/Button';
import { AllButtonVariants, BUTTON_VARIANTS, ButtonVariant } from '@/atoms/Button/Button.types';
import { extractVariants } from '@/types/variants';

import { useDialogContext } from './Context';

const GHOST_VARIANTS = {
  ...BUTTON_VARIANTS,
  variant: {
    ...BUTTON_VARIANTS.variant,
    defaultValue: ButtonVariant.GHOST,
  },
};

const useCustomButton = <T extends AllButtonVariants>(props: T): T =>
  extractVariants(GHOST_VARIANTS, props);

const Close: React.FC<ButtonProps<'button'>> = ({ className, children, ...props }) => {
  const { setOpen } = useDialogContext();

  const buttonProps = useCustomButton(props);

  return (
    <Button
      icon="close"
      aria-label="Close"
      className={clsx('dialog__close', className)}
      onClick={() => setOpen(false)}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default Close;
