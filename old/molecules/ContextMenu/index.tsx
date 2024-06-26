import { useContext } from 'react';

import ContextMenuContext from './Context';
import ContextMenu from './ContextMenu';
import Root from './Root';
import Trigger from './Trigger';

export const useContextMenu = () => useContext(ContextMenuContext);

export default Object.assign(ContextMenu, { Root, Trigger, Provider: ContextMenuContext.Provider });
