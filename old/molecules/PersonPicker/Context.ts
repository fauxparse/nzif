import { createContext, useContext } from 'react';
import { InterpreterFrom } from 'xstate';

import PersonPickerMachine from './PersonPickerMachine';

type PersonPickerContextType = {
  machine: InterpreterFrom<typeof PersonPickerMachine>;
  uniqueId: string;
};

const PersonPickerContext = createContext({} as PersonPickerContextType);

export default PersonPickerContext;

export const usePersonPicker = () => useContext(PersonPickerContext);
