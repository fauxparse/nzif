import CloseIcon from '@/icons/CloseIcon';
import { Badge, IconButton } from '@radix-ui/themes';
import clsx from 'clsx';
import { Command } from 'cmdk';
import { ComponentPropsWithoutRef, forwardRef, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { ComboboxItem, MultipleValueInputProps, PillProps } from './types';

import classes from './Combobox.module.css';

export const MultipleValueInput = <Item extends ComboboxItem, Value = Item>({
  inputRef: passedRef,
  className,
  value,
  query,
  size = '3',
  icon,
  item: renderItem,
  placeholder,
  onQueryChange,
  onFocus,
  children,
  onRemoveItem,
  ...props
}: MultipleValueInputProps<Item, Value>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const remove = (index: number) => {
    if (!value) return;
    onRemoveItem(value[index]);
  };

  useEffect(() => {
    onQueryChange('');
  }, [value, onQueryChange]);

  return (
    <>
      <div className={classes.multiInputValues}>
        {value?.map((item, index) =>
          renderItem ? (
            renderItem({ item, onRemove: () => remove(index) })
          ) : (
            <Pill key={index} item={item} onRemove={() => remove(index)}>
              {String(item)}
            </Pill>
          )
        )}
        <AutoSizeInput
          ref={mergeRefs([inputRef, passedRef])}
          className={clsx(classes.input, 'rt-reset', 'rt-TextFieldInput')}
          value={query}
          placeholder={value?.length ? undefined : placeholder}
          onValueChange={onQueryChange}
          onFocus={onFocus}
          {...props}
        />
      </div>
      {children}
    </>
  );
};

const AutoSizeInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof Command.Input>>(
  (props, ref) => {
    const [input, setInput] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!input) return;

      const changed = () => {
        input.style.width = '0';
        input.style.flexGrow = '0';
        input.style.width = `${input.scrollWidth}px`;
        input.style.removeProperty('flex-grow');
      };

      input.addEventListener('input', changed);
      changed();

      return () => input.removeEventListener('input', changed);
    }, [input]);

    return <Command.Input ref={mergeRefs([ref, setInput])} {...props} />;
  }
);

const Pill = <Item,>({ item, children, onRemove }: PillProps<Item>) => (
  <Badge className={classes.multiInputValue} size="3">
    {children}
    <IconButton className={classes.multiInputRemove} variant="ghost" size="2" onClick={onRemove}>
      <CloseIcon />
    </IconButton>
  </Badge>
);
