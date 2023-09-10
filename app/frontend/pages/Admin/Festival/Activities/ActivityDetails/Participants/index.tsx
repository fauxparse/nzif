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
import ContextMenu from '@/molecules/ContextMenu';
import Menu from '@/molecules/Menu';

import ParticipantsContext from './Context';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';
import Participant from './Participant';
import ParticipantList from './ParticipantList';
import ParticipantMenu from './ParticipantMenu';
import SortableParticipant from './SortableParticipant';
import useParticipants from './useParticipants';
import Waitlist from './Waitlist';

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

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  return (
    <ParticipantsContext.Provider value={{ session }}>
      <ContextMenu.Root>
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
            <ParticipantList id="participants" session={session} items={items.participants}>
              {items.participants.map((value, index) => {
                return (
                  <SortableParticipant
                    registration={value}
                    key={value.id}
                    id={value.id}
                    index={index}
                    containerId="participants"
                    fromWaitlist={isFromWaitlist(value)}
                  />
                );
              })}
            </ParticipantList>
            <Waitlist id="waitlist" session={session} items={items.waitlist}>
              <SortableContext items={items.waitlist} strategy={strategy}>
                {items.waitlist.map((value, index) => {
                  return (
                    <SortableParticipant
                      registration={value}
                      key={value.id}
                      id={value.id}
                      index={index}
                      containerId="waitlist"
                      fromWaitlist={true}
                    />
                  );
                })}
              </SortableContext>
            </Waitlist>
          </div>
          {createPortal(
            <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
              {active && <Participant dragOverlay registration={active} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        <ParticipantMenu session={session} />
      </ContextMenu.Root>
    </ParticipantsContext.Provider>
  );
};

export default Participants;
