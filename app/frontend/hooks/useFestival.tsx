import { graphql, ResultOf } from '@/graphql';
import { Festival } from '@/graphql/types';
import { createContext, PropsWithChildren, useContext } from 'react';

export const CurrentFestivalQuery = graphql(`
  query CurrentFestival {
    festival {
      id
      startDate
      endDate
    }
  }
`);

export type CurrentFestival = Pick<
  Festival,
  keyof ResultOf<typeof CurrentFestivalQuery>['festival']
>;

const FestivalContext = createContext<CurrentFestival>({} as CurrentFestival);

export const FestivalProvider: React.FC<PropsWithChildren<{ festival: CurrentFestival }>> = ({
  festival,
  children,
}) => <FestivalContext.Provider value={festival}>{children}</FestivalContext.Provider>;

const useFestival = () => useContext(FestivalContext);

export default useFestival;
