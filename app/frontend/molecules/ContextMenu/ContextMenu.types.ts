import { ReactElement, ReactNode } from 'react';

import { WithDisplayName } from '../../types/polymorphic.types';

export type ContextMenuProps = {
  id?: string;
};

export type ContextMenuTriggerProps = {
  id?: string;
  ref?: ((instance: HTMLElement | null) => void) | React.RefObject<HTMLElement> | null | undefined;
  children: ReactElement;
};

export type ContextMenuTriggerComponent = WithDisplayName<
  (props: ContextMenuTriggerProps) => ReactElement | null
>;
