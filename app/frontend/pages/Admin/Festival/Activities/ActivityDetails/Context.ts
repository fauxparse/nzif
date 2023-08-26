import { createContext } from 'react';

import { ActivityDetailsQuery } from '@/graphql/types';

type ActivityDetailsContextShape = ActivityDetailsQuery;

export default createContext({} as ActivityDetailsContextShape);
