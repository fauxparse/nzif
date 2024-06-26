import { createContext, useContext } from 'react';

type SelectContextProps = {
  open: boolean;
  label?: string;
  placeholder?: string;
};

const SelectContext = createContext({ open: false } as SelectContextProps);

export default SelectContext;

export const useSelectContext = () => useContext(SelectContext);
