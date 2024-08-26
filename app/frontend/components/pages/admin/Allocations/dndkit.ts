// https://github.com/clauderic/dnd-kit/issues/935#issuecomment-1902269888

import {
  Active,
  CancelDrop,
  Collision,
  CollisionDetection,
  DndContextProps,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  DroppableContainer,
  DndContext as OriginalDndContext,
  Over,
  UseDraggableArguments,
  UseDroppableArguments,
  useDndMonitor as baseUseDndMonitor,
  useDraggable as baseUseDraggable,
  useDroppable as baseUseDroppable,
} from '@dnd-kit/core';
import { Registration, Session } from './types';

const dndkit = <DragData, DropData>() => {
  type TypesafeActive = Omit<Active, 'data'> & {
    data: React.MutableRefObject<DragData | undefined>;
  };
  type TypesafeOver = Omit<Over, 'data'> & {
    data: React.MutableRefObject<DropData | undefined>;
  };

  type ContextProps = Omit<
    DndContextProps,
    | 'onDragStart'
    | 'onDragMove'
    | 'onDragOver'
    | 'onDragEnd'
    | 'onDragCancel'
    | 'cancelDrop'
    | 'collisionDetection'
  > & {
    onDragStart?: (
      e: Omit<DragStartEvent, 'active'> & {
        active: TypesafeActive;
      }
    ) => void;
    onDragMove?: (
      e: Omit<DragMoveEvent, 'active' | 'over'> & {
        active: TypesafeActive;
        over: TypesafeOver | null;
      }
    ) => void;
    onDragOver?: (
      e: Omit<DragOverEvent, 'active' | 'over'> & {
        active: TypesafeActive;
        over: TypesafeOver | null;
      }
    ) => void;
    onDragEnd?: (
      e: Omit<DragEndEvent, 'active' | 'over'> & {
        active: TypesafeActive;
        over: TypesafeOver | null;
      }
    ) => void;
    onDragCancel?: (
      e: Omit<DragCancelEvent, 'active' | 'over'> & {
        active: TypesafeActive;
        over: TypesafeOver | null;
      }
    ) => void;
    cancelDrop?: (
      e: Omit<Parameters<CancelDrop>[0], 'active' | 'over'> & {
        active: TypesafeActive;
        over: TypesafeOver | null;
      }
    ) => ReturnType<CancelDrop>;
    collisionDetection?: (
      e: Omit<Parameters<CollisionDetection>[0], 'active' | 'droppableContainers'> & {
        active: TypesafeActive;
        droppableContainers: Array<Omit<DroppableContainer, 'data'> & TypesafeOver>;
      }
    ) => Array<Omit<Collision, 'data'> & TypesafeOver>;
  };

  // biome-ignore lint/suspicious/noExplicitAny:
  const DndContext: React.NamedExoticComponent<ContextProps> = OriginalDndContext as any;

  const useDndMonitor: (
    args: Pick<
      ContextProps,
      'onDragStart' | 'onDragMove' | 'onDragOver' | 'onDragEnd' | 'onDragCancel'
    >
    // biome-ignore lint/suspicious/noExplicitAny:
  ) => void = baseUseDndMonitor as any;

  const useDraggable: (args: Omit<UseDraggableArguments, 'data'> & { data: DragData }) => Omit<
    ReturnType<typeof baseUseDraggable>,
    'active' | 'over'
  > & {
    active: TypesafeActive | null;
    over: TypesafeOver | null;
    // biome-ignore lint/suspicious/noExplicitAny:
  } = baseUseDraggable as any;

  const useDroppable: (args: Omit<UseDroppableArguments, 'data'> & { data: DropData }) => Omit<
    ReturnType<typeof baseUseDroppable>,
    'active' | 'over'
  > & {
    active: TypesafeActive | null;
    over: TypesafeOver | null;
    // biome-ignore lint/suspicious/noExplicitAny:
  } = baseUseDroppable as any;

  return { DndContext, useDndMonitor, useDraggable, useDroppable };
};

export type DraggableData = {
  registration: Registration;
  slots: Session['slots'];
  session: Session | null;
  waitlist: boolean;
};

export type DroppableData = {
  session: Session | null;
  slots: Session['slots'];
  waitlist: boolean;
};

export const { DndContext, useDraggable, useDroppable, useDndMonitor } = dndkit<
  DraggableData,
  DroppableData
>();

type TypesafeActive = Omit<Active, 'data'> & {
  data: React.MutableRefObject<DraggableData | undefined>;
};
type TypesafeOver = Omit<Over, 'data'> & {
  data: React.MutableRefObject<DroppableData | undefined>;
};

type TypesafeDragStartEvent = Omit<DragStartEvent, 'active'> & {
  active: TypesafeActive;
};

type TypesafeDragMoveEvent = Omit<DragMoveEvent, 'active' | 'over'> & {
  active: TypesafeActive;
  over: TypesafeOver | null;
};

type TypesafeDragOverEvent = Omit<DragOverEvent, 'active' | 'over'> & {
  active: TypesafeActive;
  over: TypesafeOver | null;
};

type TypesafeDragEndEvent = Omit<DragEndEvent, 'active' | 'over'> & {
  active: TypesafeActive;
  over: TypesafeOver | null;
};

type TypesafeDragCancelEvent = Omit<DragCancelEvent, 'active' | 'over'> & {
  active: TypesafeActive;
  over: TypesafeOver | null;
};

type TypesafeCancelDrop = Omit<Parameters<CancelDrop>[0], 'active' | 'over'> & {
  active: TypesafeActive;
  over: TypesafeOver | null;
};

type TypesafeCollisionDetection = (
  e: Omit<Parameters<CollisionDetection>[0], 'active' | 'droppableContainers'> & {
    active: TypesafeActive;
    droppableContainers: Array<Omit<DroppableContainer, 'data'> & TypesafeOver>;
  }
) => Array<Omit<Collision, 'data'> & TypesafeOver>;

export type {
  TypesafeDragStartEvent as DragStartEvent,
  TypesafeDragMoveEvent as DragMoveEvent,
  TypesafeDragOverEvent as DragOverEvent,
  TypesafeDragEndEvent as DragEndEvent,
  TypesafeDragCancelEvent as DragCancelEvent,
  TypesafeCancelDrop as CancelDrop,
  TypesafeCollisionDetection as CollisionDetection,
};
