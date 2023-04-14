import { createContext } from 'react';

import { Crumb } from './Breadcrumbs.types';

const Context = createContext({ crumbs: [] } as { crumbs: Crumb[] });

export default Context;
