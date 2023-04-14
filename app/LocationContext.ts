import { createContext } from 'react';
import { Location } from 'react-router-dom';

export default createContext({} as { location: Location; previousLocation: Location | undefined });
