import { ResultOf, graphql } from '@/graphql';
import { Festival } from '@/graphql/types';
import { range } from 'lodash-es';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

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

export const useFestival = () => useContext(FestivalContext);

export const useFestivalDates = () => {
  const festival = useFestival();

  const dates = useMemo(() => {
    const n = festival.endDate.diff(festival.startDate, 'days').days + 1;
    return range(n).map((days) => festival.startDate.plus({ days }));
  }, [festival.startDate, festival.endDate]);

  return dates;
};
