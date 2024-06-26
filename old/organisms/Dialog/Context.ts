import { createContext, useContext } from 'react';

const DialogContext = createContext(
  {} as {
    open: boolean;
    setOpen: (open: boolean) => void;
  }
);

export default DialogContext;

export const useDialogContext = () => useContext(DialogContext);
