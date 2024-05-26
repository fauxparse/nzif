import { Box } from '@mantine/core';
import { ResultOf } from 'gql.tada';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import { TimetableQuery } from './queries';
import { useTimetable } from './useTimetable';

import { BaseBlock, Block } from './Block';
import './TimetableEditor.css';
import { LaidOutSession } from './types';

type TimetableEditorProps = {
  loading?: boolean;
  data: ResultOf<typeof TimetableQuery> | undefined;
};

export const TimetableEditor: React.FC<TimetableEditorProps> = ({ data }) => {
  const {
    startsAt,
    startHour,
    endHour,
    granularity,
    rows,
    columns,
    topLeft,
    firstColumn,
    rowMouseDown,
    rowMouseMove,
    resizeMouseDown,
    dragMouseDown,
    selection,
    sessions,
    resizing,
    dragging,
  } = useTimetable(data);

  return (
    <Box
      className="timetable-editor"
      __vars={{
        '--granularity': String(granularity),
        '--start-hour': String(startHour),
        '--end-hour': String(endHour),
        '--rows': String(rows),
        '--columns': String(columns),
      }}
    >
      <Box className="grid" data-dragging={!!dragging || undefined}>
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
              style={{ gridRow: row + 2 }}
              __vars={{ '--tracks': String(tracks) }}
              data-row={row}
              onMouseDown={rowMouseDown}
              onMouseMove={rowMouseMove}
            >
              <Box className="grid__row-header">
                <TimetableDate date={startsAt.plus({ days: row })} />
              </Box>
              {day.map(({ session, track, rect }) => (
                <Block
                  key={session.id}
                  session={session}
                  track={track}
                  rect={rect}
                  resizing={resizing?.id === session.id}
                  dragging={!!dragging && dragging.laidOutSession.session.id === session.id}
                  onStartResize={resizeMouseDown}
                  onStartDrag={dragMouseDown}
                />
              ))}
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
            data-ghost
          />
        )}
      </Box>
    </Box>
  );
};

const TimetableDate = ({ date }: { date: DateTime }) => (
  <span className="date">
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
