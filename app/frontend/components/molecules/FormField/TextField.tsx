import { TextField as RadixTextField } from '@radix-ui/themes';
import { forwardRef, useContext } from 'react';
import { FormFieldContext } from './Context';

type TextFieldProps = RadixTextField.RootProps & {
  onValueChange?: (value: string) => void;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ onValueChange, ...props }, ref) => {
    const { id, size, variant } = useContext(FormFieldContext);

    return (
      <RadixTextField.Root
        id={id}
        size={size}
        variant={variant}
        onChange={(e) => onValueChange?.(e.currentTarget.value)}
        {...props}
        ref={ref}
      />
    );
  }
);
