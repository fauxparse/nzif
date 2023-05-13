import { createContext, useContext } from 'react';

import { FestivalQuery, Maybe } from '@/graphql/types';

const Context = createContext({} as { festival: FestivalQuery['festival'] });

export default Context;

export const useFestival = () => useContext(Context).festival;
