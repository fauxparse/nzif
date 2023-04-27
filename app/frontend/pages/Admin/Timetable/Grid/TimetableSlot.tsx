import React, { ComponentPropsWithoutRef, useRef } from 'react';
import { camelCase } from 'lodash-es';

import Icon, { IconName } from '@/atoms/Icon';
import { SlotAttributes, TimetableSlotFragment, useUpdateSlotMutation } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';

import { useGridContext } from './Context';
import ResizeHandle from './ResizeHandle';
import { Block } from './useTimetable';

type TimetableSlotProps = ComponentPropsWithoutRef<'div'> & {
  slot: Block<TimetableSlotFragment>;
};

const TimetableSlot: React.FC<TimetableSlotProps> = React.memo(({ slot, ...props }) => {
  const container = useRef<HTMLDivElement | null>(null);

  const [updateSlot] = useUpdateSlotMutation();

  const { cellToTime, timeToCell } = useGridContext();

  const update = (attributes: Partial<SlotAttributes>) =>
    updateSlot({
      variables: {
        id: slot.data.id,
        attributes: attributes as SlotAttributes,
      },
    });

  const dragStartEdge = (column: number, final = false) => {
    if (!container.current) return;
    const right = slot.column + slot.width - 1;
    const left = Math.min(right, column);
    container.current.style.gridColumn = `${left + 2} / span ${right - left + 1}`;

    if (!final) return;
    const { row } = timeToCell(slot.data.startsAt);
    const startsAt = cellToTime({ row, column: left });
    if (startsAt) update({ startsAt });
  };

  const dragEndEdge = (column: number, final = false) => {
    if (!container.current) return;
    const width = Math.max(1, column - slot.column + 1);
    container.current.style.gridColumn = `${slot.column + 2} / span ${width}`;

    if (!final) return;
    const { row } = timeToCell(slot.data.startsAt);
    const endsAt = cellToTime({ row, column: column + 1 });
    if (endsAt) update({ endsAt });
  };

  return (
    <ContextMenu.Trigger id="slot">
      <div
        ref={container}
        className="timetable__slot"
        style={{
          gridRow: `${slot.row + 2} / span ${slot.height}`,
          gridColumn: `${slot.column + 2} / span ${slot.width}`,
        }}
        data-id={slot.data.id}
        {...props}
      >
        <Icon name={camelCase(slot.data.activityType) as IconName} />
        <span className="timetable__slot__type">{slot.data.activityType}</span>
        <span className="timetable__slot__venue">
          {slot.data.venue?.room || slot.data.venue?.building}
        </span>
        <ResizeHandle side="start" column={slot.column} onDrag={dragStartEdge} />
        <ResizeHandle side="end" column={slot.column + slot.width - 1} onDrag={dragEndEdge} />
      </div>
    </ContextMenu.Trigger>
  );
});

TimetableSlot.displayName = 'TimetableSlot';

export default TimetableSlot;
