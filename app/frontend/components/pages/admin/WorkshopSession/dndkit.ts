import { dndkit } from '@/util/dndkit';
import type {
  TypesafeCancelDrop,
  TypesafeCollisionDetection,
  TypesafeDragCancelEvent,
  TypesafeDragEndEvent,
  TypesafeDragMoveEvent,
  TypesafeDragOverEvent,
  TypesafeDragStartEvent,
} from '@/util/dndkit';

import type { ListId, Registration } from './types';

type Sortable = {
  containerId: ListId;
  index: number;
  items: Registration[];
};

export type DraggableData = {
  registration: Registration;
  sortable?: Sortable;
};

export type DroppableData = {
  trash?: boolean;
  waitlist?: boolean;
  sortable?: Sortable;
};

export const { DndContext, useDraggable, useDroppable, useDndMonitor } = dndkit<
  DraggableData,
  DroppableData
>();

export type DragStartEvent = TypesafeDragStartEvent<DraggableData>;
export type DragMoveEvent = TypesafeDragMoveEvent<DraggableData, DroppableData>;
export type DragOverEvent = TypesafeDragOverEvent<DraggableData, DroppableData>;
export type DragEndEvent = TypesafeDragEndEvent<DraggableData, DroppableData>;
export type DragCancelEvent = TypesafeDragCancelEvent<DraggableData, DroppableData>;
export type CancelDrop = TypesafeCancelDrop<DraggableData, DroppableData>;
export type CollisionDetection = TypesafeCollisionDetection<DraggableData, DroppableData>;
