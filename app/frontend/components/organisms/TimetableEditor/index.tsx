import {
  ActivityAttributes,
  ActivityType,
  MultipleSessionAttributes,
  SessionAttributes,
} from '@/graphql/types';
import { useDisclosure } from '@/hooks/useDisclosure';
import { FetchResult } from '@apollo/client';
import { Box } from '@radix-ui/themes';
import { LayoutGroup } from 'framer-motion';
import { ResultOf } from 'gql.tada';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import { CSSProperties, useCallback, useState } from 'react';
import { BaseBlock, Block } from './Block';
import { SessionModal } from './SessionModal';
import {
  CreateSessionsMutation,
  DestroySessionMutation,
  TimetableQuery,
  UpdateSessionMutation,
} from './queries';
import { Activity, LaidOutSession, Session } from './types';
import { useTimetable } from './useTimetable';

import './TimetableEditor.css';

type TimetableEditorProps = {
  loading?: boolean;
  data: ResultOf<typeof TimetableQuery> | undefined;
  onCreateActivity: (
    type: ActivityType,
    attributes: Partial<ActivityAttributes>
  ) => Promise<Activity>;
  onCreateSessions: (
    attributes: MultipleSessionAttributes
  ) => Promise<FetchResult<ResultOf<typeof CreateSessionsMutation>>>;
  onUpdateSession: (
    id: string,
    attributes: Partial<SessionAttributes>
  ) => Promise<FetchResult<ResultOf<typeof UpdateSessionMutation>>>;
  onDeleteSession: (id: string) => Promise<FetchResult<ResultOf<typeof DestroySessionMutation>>>;
};

export const TimetableEditor: React.FC<TimetableEditorProps> = ({
  data,
  onCreateSessions,
  onCreateActivity,
  onUpdateSession,
  onDeleteSession,
}) => {
  const [editing, setEditing] = useState<Session | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const editSession = useCallback((session: Session) => {
    setEditing(session);
    setTimeout(open, 100);
  }, []);

  const {
    startsAt,
    startHour,
    endHour,
    granularity,
    rows,
    columns,
    topLeft,
    firstColumn,
    rowPointerDown,
    rowPointerMove,
    startResize,
    startDrag,
    selection,
    clearSelection,
    sessions,
    resizing,
    dragging,
  } = useTimetable(data, {
    onSelect: editSession,
    onChange: onUpdateSession,
  });

  return (
    <Box
      className="timetable-editor"
      style={
        {
          '--granularity': String(granularity),
          '--start-hour': String(startHour),
          '--end-hour': String(endHour),
          '--rows': String(rows),
          '--columns': String(columns),
        } as CSSProperties
      }
    >
      <Box
        className="grid"
        data-dragging={!!dragging || undefined}
        data-resizing={!!resizing || undefined}
      >
        <Box className="grid__columns">
          <Box ref={topLeft} className="grid__row-header grid__column-header" />
          {range(columns / granularity).map((column) => (
            <Box
              ref={!column ? firstColumn : undefined}
              className="grid__column-header"
              key={column}
              style={{ gridColumn: `${column * granularity + 2} / span ${granularity}` }}
            >
              <TimetableTime time={startsAt.plus({ hours: column })} />
            </Box>
          ))}
          <Box className="grid__column-header" />
        </Box>
        {range(rows).map((row) => {
          const day = (sessions[row] || []) as LaidOutSession[];
          const tracks = day.reduce((acc: number, { track }) => Math.max(acc, track), 0) + 1;

          return (
            <Box
              className="grid__row"
              key={row}
              style={
                {
                  gridRow: row + 2,
                  '--tracks': String(tracks),
                  '--sessions': String(day.length),
                } as CSSProperties
              }
              data-row={row}
              onPointerDown={rowPointerDown}
              onPointerMove={rowPointerMove}
            >
              <Box className="grid__row-header">
                <TimetableDate date={startsAt.plus({ days: row })} />
              </Box>
              <LayoutGroup>
                {day.map(({ session, track, rect }) => (
                  <Block
                    key={session.id}
                    session={session}
                    track={track}
                    rect={rect}
                    resizing={resizing?.id === session.id}
                    dragging={!!dragging && dragging.laidOutSession.session.id === session.id}
                    animate={!dragging && !resizing}
                    onStartResize={startResize}
                    onStartDrag={startDrag}
                    onClick={editSession}
                  />
                ))}
              </LayoutGroup>
            </Box>
          );
        })}
        {selection && (
          <Box
            className="grid__selection"
            style={{
              gridRowStart: selection.start.row + 2,
              gridColumnStart: selection.start.column + 2,
              gridRowEnd: selection.end.row + 3,
              gridColumnEnd: selection.end.column + 3,
            }}
          />
        )}
        {dragging && (
          <BaseBlock
            session={dragging.laidOutSession.session}
            rect={dragging.rect}
            style={{ gridRow: dragging.rect.start.row + 2 }}
            animate={false}
            data-ghost
          />
        )}
      </Box>
      {editing && (
        <SessionModal
          session={editing}
          venues={data?.festival?.venues || []}
          open={opened}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              close();
              clearSelection();
            }
          }}
          onCreateSessions={onCreateSessions}
          onCreateActivity={onCreateActivity}
          onUpdateSession={onUpdateSession}
          onDeleteSession={onDeleteSession}
        />
      )}
    </Box>
  );
};

const TimetableDate = ({ date }: { date: DateTime }) => (
  <span className="date">
    <span className="weekday--short">{date.toFormat('ccc')}</span>
    <span className="weekday">{date.toFormat('cccc')}</span>
    <span className="day">{date.toFormat('d')}</span>
  </span>
);

const TimetableTime = ({ time }: { time: DateTime }) => (
  <span className="time" data-meridiem={time.toFormat('a')}>
    <span className="hour">{time.toFormat('h:mm')}</span>
    <span className="meridiem">{time.toFormat('a')}</span>
  </span>
);
