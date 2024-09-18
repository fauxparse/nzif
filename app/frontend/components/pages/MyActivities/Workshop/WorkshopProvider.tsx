import { ResultOf } from '@/graphql';
import { PropsWithChildren, createContext, useContext } from 'react';
import { MyWorkshopSessionQuery } from './queries';

type WorkshopContextType = {
  session: ResultOf<typeof MyWorkshopSessionQuery>['session'];
};

const WorkshopContext = createContext<WorkshopContextType>({} as WorkshopContextType);

export const WorkshopProvider: React.FC<PropsWithChildren<WorkshopContextType>> = ({
  children,
  session,
}) => {
  return <WorkshopContext.Provider value={{ session }}>{children}</WorkshopContext.Provider>;
};

export const useWorkshopSession = () => useContext(WorkshopContext);
