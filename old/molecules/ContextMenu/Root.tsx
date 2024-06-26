import { PropsWithChildren, useState } from 'react';

import ContextMenuContext from './Context';

const Root: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);
  const [currentTarget, setCurrentTarget] = useState<HTMLElement | null>(null);

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const open = (id: string, event: React.MouseEvent<HTMLElement>) => {
    setPosition({ x: event.clientX, y: event.clientY });
    setCurrentMenu(id);
    setCurrentTarget(event.currentTarget);
  };

  const close = () => setCurrentMenu(null);

  return (
    <ContextMenuContext.Provider value={{ currentMenu, currentTarget, position, open, close }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export default Root;
