import Empty from './Empty';
import Item from './Item';
import Menu from './Menu';
import { MenuProps } from './Menu.types';
import Separator from './Separator';

export type { MenuProps };

export default Object.assign(Menu, { Item, Empty, Separator });
