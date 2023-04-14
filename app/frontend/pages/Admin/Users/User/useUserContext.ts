import { createContext, useContext } from 'react';

import { User } from '../../../../graphql/types';

type ContextType = { user: User | null; basePath: string };

export const UserContext = createContext({} as ContextType);

const useUserContext = () => useContext<ContextType>(UserContext);

export default useUserContext;
