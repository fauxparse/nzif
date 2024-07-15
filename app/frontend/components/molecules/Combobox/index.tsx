import { Combobox as Root } from './Combobox';
import { ListItem } from './ListItem';
import { MultipleValueInput as Multiple } from './MultipleValueInput';
import { SingleValueInput as Input } from './SingleValueInput';

export const Combobox = { Root, Input, Multiple, Item: ListItem };

export type { ComboboxItem } from './types';
