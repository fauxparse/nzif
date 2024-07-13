import { Command } from 'cmdk';
import { Combobox as Root } from './Combobox';
import { MultipleValueInput as Multiple } from './MultipleValueInput';
import { SingleValueInput as Input } from './SingleValueInput';

export const Combobox = { Root, Input, Multiple, Item: Command.Item };
