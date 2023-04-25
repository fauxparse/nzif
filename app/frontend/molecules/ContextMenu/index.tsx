import ContextMenuContext from './Context';
import ContextMenu from './ContextMenu';
import Root from './Root';
import Trigger from './Trigger';

export default Object.assign(ContextMenu, { Root, Trigger, Provider: ContextMenuContext.Provider });
