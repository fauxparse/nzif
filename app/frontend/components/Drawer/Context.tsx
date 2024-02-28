import { createContext, useContext } from 'react';

type DrawerContextType = {
  close: () => void;
};

const DrawerContext = createContext<DrawerContextType>({ close: () => void 0 });

export const useDrawerContext = () => useContext(DrawerContext);

export default DrawerContext;
