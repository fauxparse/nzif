import EmptyIcon from '@/icons/EmptyIcon';
import { Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { Command } from 'cmdk';
import { ComboboxItem, ListItemProps } from './types';

import classes from './Combobox.module.css';

export const ListItem = <Item extends ComboboxItem>({
  className,
  icon,
  item,
  value,
  onSelect,
  children,
}: ListItemProps<Item>) => (
  <Command.Item
    className={clsx(className, classes.result)}
    value={value ?? item.label}
    onSelect={() => onSelect(item)}
  >
    {icon || <EmptyIcon />}
    <Text truncate>{item.label}</Text>
    {children}
  </Command.Item>
);
