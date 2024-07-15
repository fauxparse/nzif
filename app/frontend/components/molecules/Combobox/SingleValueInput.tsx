import clsx from 'clsx';
import { Command } from 'cmdk';
import { useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { ComboboxInputProps, ComboboxItem } from './types';

import classes from './Combobox.module.css';

export const SingleValueInput = <Item extends ComboboxItem, Value>({
  className,
  inputRef: passedRef,
  value,
  size,
  icon,
  query,
  onQueryChange,
  onFocus,
  children,
  ...props
}: ComboboxInputProps<Item, Value>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Command.Input
        ref={mergeRefs([inputRef, passedRef])}
        className={clsx(classes.input, 'rt-reset', 'rt-TextFieldInput')}
        value={query}
        onValueChange={onQueryChange}
        onFocus={onFocus}
        {...props}
      />
      {children}
    </>
  );
};
