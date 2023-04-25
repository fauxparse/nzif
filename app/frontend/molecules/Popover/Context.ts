import { createContext, useContext } from 'react';

type PopoverContextProps = { open: boolean; setOpen: (open: boolean) => void };

const PopoverContext = createContext<PopoverContextProps>({ open: false, setOpen: () => void 0 });

export default PopoverContext;

export const usePopoverContext = () => useContext(PopoverContext);
