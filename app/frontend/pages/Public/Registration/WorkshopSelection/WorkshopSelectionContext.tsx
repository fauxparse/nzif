import { createContext, useContext } from 'react';
import { DateTime } from 'luxon';

import { RegistrationSlotFragment, RegistrationWorkshopFragment } from '@/graphql/types';

import { SelectedWorkshop } from './types';

type WorkshopSelectionContextType = {
  loading: boolean;
  registrationStage: 'earlybird' | 'regular';
  slots: RegistrationSlotFragment[];
  selected: Map<DateTime, RegistrationWorkshopFragment[]>;
  add: (workshop: SelectedWorkshop) => void;
  remove: (workshop: SelectedWorkshop) => void;
  moreInfo: (workshop: SelectedWorkshop | null) => void;
};

const WorkshopSelectionContext = createContext<WorkshopSelectionContextType>(
  {} as WorkshopSelectionContextType
);

export const useWorkshopSelectionContext = () => useContext(WorkshopSelectionContext);

export default WorkshopSelectionContext;
