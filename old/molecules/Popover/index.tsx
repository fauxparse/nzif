import Body from './Body';
import Close from './Close';
import Footer from './Footer';
import Header from './Header';
import Popover from './Popover';
import { PopoverProps } from './Popover.types';

export { usePopoverContext } from './Context';

export type { PopoverProps };

export default Object.assign(Popover, { Header, Body, Footer, Close });
