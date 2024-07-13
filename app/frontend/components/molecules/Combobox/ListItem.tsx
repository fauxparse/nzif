import EmptyIcon from '@/icons/EmptyIcon';
import { Text } from '@radix-ui/themes';
import { Command } from 'cmdk';
import { ComboboxItem, ListItemProps } from './types';

import classes from './Combobox.module.css';

export const ListItem = <Item extends ComboboxItem>({
  icon,
  item,
  onSelect,
  children,
}: ListItemProps<Item>) => (
  <Command.Item className={classes.result} value={item.label} onSelect={() => onSelect(item)}>
    {icon || <EmptyIcon />}
    <Text truncate>{item.label}</Text>
    {children}
  </Command.Item>
);
