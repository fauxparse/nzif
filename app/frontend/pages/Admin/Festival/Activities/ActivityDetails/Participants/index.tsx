import React from 'react';
import { createPortal } from 'react-dom';
import {
  CancelDrop,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardCoordinateGetter,
  KeyboardSensor,
  MeasuringStrategy,
  Modifiers,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, SortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { AdminActivitySessionDetailsFragment } from '@/graphql/types';

import ParticipantsContext from './Context';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';
import Participant from './Participant';
import ParticipantList from './ParticipantList';
import SortableParticipant from './SortableParticipant';
import useParticipants from './useParticipants';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.25',
      },
    },
  }),
};

type ParticipantsProps = {
  session: AdminActivitySessionDetailsFragment;

  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  handle?: boolean;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  scrollable?: boolean;
  vertical?: boolean;
};

const Participants: React.FC<ParticipantsProps> = ({
  session,
  adjustScale = false,
  cancelDrop,
  coordinateGetter = multipleContainersCoordinateGetter,
  modifiers,
  strategy = verticalListSortingStrategy,
}: ParticipantsProps) => {
  const { items, active, start, drag, drop, cancel, isFromWaitlist } = useParticipants(session);
  const containers = ['participants', 'waitlist'] as const;

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  return (
    <ParticipantsContext.Provider value={{ session }}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={start}
        onDragOver={drag}
        onDragEnd={drop}
        cancelDrop={cancelDrop}
        onDragCancel={cancel}
        modifiers={modifiers}
      >
        <div className="session__participant-lists">
          {containers.map((containerId) => (
            <ParticipantList
              key={containerId}
              id={containerId}
              session={session}
              items={items[containerId]}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  return (
                    <SortableParticipant
                      registration={value}
                      key={value.id}
                      id={value.id}
                      index={index}
                      containerId={containerId}
                      fromWaitlist={isFromWaitlist(value)}
                    />
                  );
                })}
              </SortableContext>
            </ParticipantList>
          ))}
        </div>
        {createPortal(
          <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
            {active && <Participant dragOverlay registration={active} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </ParticipantsContext.Provider>
  );
};

export default Participants;
