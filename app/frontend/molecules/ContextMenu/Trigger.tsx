import { cloneElement, forwardRef } from 'react';

import { useContextMenu } from './Context';
import { ContextMenuTriggerComponent } from './ContextMenu.types';

const Trigger: ContextMenuTriggerComponent = forwardRef(({ id = 'default', children }, ref) => {
  const { open } = useContextMenu();

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    open(id, event);
  };

  return cloneElement(children, { ref, onContextMenu });
});

Trigger.displayName = 'ContextMenu.Trigger';

export default Trigger;
