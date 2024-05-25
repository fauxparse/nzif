import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { CurrentFestival } from './hooks/useFestival';
import { AuthenticationContextType } from './services/Authentication';

export type RouterContext = {
  auth: AuthenticationContextType;
  client: ApolloClient<NormalizedCacheObject>;
  festival: CurrentFestival;
  year: string;
  getTitle?: (data: unknown) => string;
};
