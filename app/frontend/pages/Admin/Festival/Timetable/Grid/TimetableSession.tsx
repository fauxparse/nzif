import React, { ComponentPropsWithoutRef, useRef } from 'react';
import clsx from 'clsx';
import { kebabCase } from 'lodash-es';

import {
  SessionAttributes,
  TimetableSessionFragment,
  useUpdateSessionMutation,
} from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';

import { useGridContext } from './Context';
import ResizeHandle from './ResizeHandle';
import { Block } from './useTimetable';

type TimetableSessionProps = Omit<ComponentPropsWithoutRef<'div'>, 'session'> & {
  session: Block<TimetableSessionFragment>;
  hidden?: boolean;
};

const TimetableSession: React.FC<TimetableSessionProps> = React.memo(
  ({ session, hidden, ...props }) => {
    const container = useRef<HTMLDivElement | null>(null);

    const [updateSession] = useUpdateSessionMutation();

    const { cellToTime, timeToCell } = useGridContext();

    const update = (attributes: Partial<SessionAttributes>) =>
      updateSession({
        variables: {
          id: session.data.id,
          attributes: attributes as SessionAttributes,
        },
      });

    const dragStartEdge = (column: number, final = false) => {
      if (!container.current) return;
      const right = session.column + session.width - 1;
      const left = Math.min(right, column);
      container.current.style.gridColumn = `${left + 2} / span ${right - left + 1}`;

      if (!final) return;
      const { row } = timeToCell(session.data.startsAt);
      const startsAt = cellToTime({ row, column: left });
      if (startsAt) update({ startsAt });
    };

    const dragEndEdge = (column: number, final = false) => {
      if (!container.current) return;
      const width = Math.max(1, column - session.column + 1);
      container.current.style.gridColumn = `${session.column + 2} / span ${width}`;

      if (!final) return;
      const { row } = timeToCell(session.data.startsAt);
      const endsAt = cellToTime({ row, column: column + 1 });
      if (endsAt) update({ endsAt });
    };

    return (
      <ContextMenu.Trigger id="session">
        <div
          ref={container}
          className={clsx('timetable__session', session.data.activity && 'timetable__activity')}
          style={{
            gridRow: `${session.row + 2} / span ${session.height}`,
            gridColumn: `${session.column + 2} / span ${session.width}`,
            opacity: hidden ? 0 : undefined,
          }}
          data-id={session.data.id}
          data-activity-type={kebabCase(session.data.activityType)}
          {...props}
        >
          <span className="timetable__session__title">
            {session.data.activity?.name || session.data.activityType}
          </span>
          <span className="timetable__session__venue">
            {session.data.venue?.room || session.data.venue?.building}
          </span>
          <ResizeHandle side="start" column={session.column} onDrag={dragStartEdge} />
          <ResizeHandle
            side="end"
            column={session.column + session.width - 1}
            onDrag={dragEndEdge}
          />
        </div>
      </ContextMenu.Trigger>
    );
  }
);

TimetableSession.displayName = 'TimetableSession';

export default TimetableSession;
