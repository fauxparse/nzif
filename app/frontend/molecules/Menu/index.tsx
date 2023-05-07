import Empty from './Empty';
import Item from './Item';
import Menu from './Menu';
import { MenuProps } from './Menu.types';

export type { MenuProps };

export default Object.assign(Menu, { Item, Empty });
