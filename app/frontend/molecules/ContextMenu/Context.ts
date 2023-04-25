import React, { createContext, useContext } from 'react';

type ContextMenuContextProps = {
  currentMenu: string | null;
  currentTarget: HTMLElement | null;
  position: { x: number; y: number };
  open: (id: string, event: React.MouseEvent<HTMLElement>) => void;
  close: () => void;
};

const ContextMenuContext = createContext({} as ContextMenuContextProps);

export default ContextMenuContext;

export const useContextMenu = () => useContext(ContextMenuContext);
