import { TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import { PropsWithChildren, ReactNode, Ref, RefObject, forwardRef } from 'react';
import { ComboboxItem } from './types';

import classes from './Combobox.module.css';

type InputWrapperProps<Item extends ComboboxItem, Value> = PropsWithChildren<{
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  size?: TextField.RootProps['size'];
  icon?: ReactNode;
}>;

export const InputWrapper = forwardRef(
  <Item extends ComboboxItem, Value>(
    { inputRef, className, size = '3', icon, children }: InputWrapperProps<Item, Value>,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          classes.root,
          'rt-TextFieldRoot',
          'rt-variant-surface',
          `rt-r-size-${size}`
        )}
        onPointerDown={(event) => {
          const input = inputRef.current;
          if (!input) return;

          const target = event.target as HTMLElement;
          if (target.closest('input, button, a')) return;

          // Same selector as in the CSS to find the right slot
          const isRightSlot = target.closest(`
              .rt-TextFieldSlot[data-side='right'],
              .rt-TextFieldSlot:not([data-side='right']) ~ .rt-TextFieldSlot:not([data-side='left'])
            `);

          const cursorPosition = isRightSlot ? input.value.length : 0;

          requestAnimationFrame(() => {
            try {
              input.setSelectionRange(cursorPosition, cursorPosition);
            } catch (e) {}
            input.focus();
          });
        }}
      >
        {icon && <TextField.Slot side="left">{icon}</TextField.Slot>}
        {children}
      </div>
    );
  }
);
