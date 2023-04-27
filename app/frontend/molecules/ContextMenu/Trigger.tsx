import { cloneElement, forwardRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { get } from 'lodash-es';

import { useContextMenu } from './Context';
import { ContextMenuTriggerComponent } from './ContextMenu.types';

const Trigger: ContextMenuTriggerComponent = forwardRef(({ id = 'default', children }, ref) => {
  const { open } = useContextMenu();

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    open(id, event);
  };

  return cloneElement(children, {
    onContextMenu,
    ref: mergeRefs(
      [
        ref,
        get(children, 'ref') as unknown as
          | React.MutableRefObject<HTMLElement | null>
          | React.LegacyRef<HTMLElement | null>,
      ].filter(Boolean)
    ),
  });
});

Trigger.displayName = 'ContextMenu.Trigger';

export default Trigger;
