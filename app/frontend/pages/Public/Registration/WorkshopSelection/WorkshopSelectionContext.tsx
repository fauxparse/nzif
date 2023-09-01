import { createContext, useContext } from 'react';

import {
  RegistrationPhase,
  RegistrationSessionFragment,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
} from '@/graphql/types';

import { ConfirmOptions } from './ConfirmationModal';

type WorkshopSelectionContextType = {
  loading: boolean;
  registrationPhase: RegistrationPhase;
  slots: RegistrationSlotFragment[];
  selected: Map<number, RegistrationWorkshopFragment[]>;
  waitlist: Set<string>;
  zoomed: RegistrationSessionFragment | null;
  add: (session: RegistrationSessionFragment) => void;
  remove: (session: RegistrationSessionFragment) => void;
  moreInfo: (session: RegistrationSessionFragment | null) => void;
  confirm: (options: ConfirmOptions) => Promise<void>;
};

const WorkshopSelectionContext = createContext<WorkshopSelectionContextType>(
  {} as WorkshopSelectionContextType
);

export const useWorkshopSelectionContext = () => useContext(WorkshopSelectionContext);

export default WorkshopSelectionContext;
