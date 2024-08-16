import { TextArea as RadixTextArea, TextAreaProps as RadixTextAreaProps } from '@radix-ui/themes';
import { forwardRef, useContext } from 'react';
import { FormFieldContext } from './Context';

type TextAreaProps = RadixTextAreaProps & {
  onValueChange?: (value: string) => void;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ onValueChange, ...props }, ref) => {
    const { id, size, variant } = useContext(FormFieldContext);

    return (
      <RadixTextArea
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
