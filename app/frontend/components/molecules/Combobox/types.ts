import { TextField } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

export type ComboboxItem = {
  id: string;
  label: string;
};

export type UseComboboxOptions<Item extends ComboboxItem, Value> = {
  value: Value;
  items: Item[] | ((query: string) => Promise<Item[]>);
  debounce?: number;
  enableAdd?: boolean;
  onSelect: (item: Item | null) => void;
  onAdd?: (query: string) => Promise<Item | null>;
};

export type ComboboxProps<Item extends ComboboxItem, Value = Item> = Omit<
  UseComboboxOptions<Item, Value>,
  'value'
> & {
  className?: string;
  icon?: React.ReactNode;
  size?: '1' | '2' | '3';
  value?: Value | null;
  placeholder?: string;
  input?: (props: ComboboxInputProps<Item, Value>) => React.ReactElement;
  item?: (props: ListItemProps<Item>) => React.ReactNode;
};

export type ComboboxInputProps<Item extends ComboboxItem, Value> = Omit<
  TextField.RootProps,
  'value' | 'onValueChange'
> & {
  icon?: React.ReactNode;
  inputRef: React.Ref<HTMLInputElement>;
  value?: Value | null;
  query: string;
  onQueryChange: (value: string) => void;
};

export type MultipleValueInputProps<Item extends ComboboxItem, Value = Item> = ComboboxInputProps<
  Item,
  Value[]
> & {
  item?: (props: PillProps<Value>) => React.ReactNode;
  onRemoveItem: (item: Value) => void;
};

export type ListItemProps<Item extends ComboboxItem> = PropsWithChildren<{
  className?: string;
  icon?: React.ReactNode;
  item: Item;
  value?: string;
  onSelect: (item: Item) => void;
}>;

export type PillProps<Item> = PropsWithChildren<{
  item: Item;
  onRemove?: () => void;
}>;
