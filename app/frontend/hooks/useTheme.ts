import { RefObject } from 'react';

const useTheme = (ref: RefObject<HTMLElement>) =>
  ref.current?.closest('[data-theme]')?.getAttribute('data-theme') || 'light';

export default useTheme;
