import { useContext } from 'react';

import Context from './Context';
import Toaster from './Toaster';
import { ToasterProps } from './Toaster.types';

export { Toaster };
export type { ToasterProps };

export default Toaster;

export const useToaster = () => useContext(Context);
