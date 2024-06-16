import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import ShareIcon from '@/icons/ShareIcon';
import { ActionIcon } from '@mantine/core';
import { groupBy, sortBy, values } from 'lodash-es';
import { useMemo } from 'react';
import { CalendarSession } from './types';

import './Calendar.css';
import { Day } from './Day';

type CalendarProps = {
  loading?: boolean;
  sessions: CalendarSession[];
};

export const Calendar: React.FC<CalendarProps> = ({ sessions }: CalendarProps) => {
  const days = useMemo(
    () =>
      sortBy(
        values(groupBy(sessions, ({ session }) => session.startsAt.toISODate())),
        (group) => group[0].session.startsAt
      ),
    [sessions]
  );

  return (
    <div className="calendar">
      <Header
        title="My calendar"
        actions={
          <ActionIcon variant="subtle" data-color="neutral">
            <ShareIcon />
          </ActionIcon>
        }
      />
      <Body className="calendar">
        {days.map((day) => (
          <Day
            key={day[0].session.startsAt.toISODate()}
            date={day[0].session.startsAt}
            sessions={day}
          />
        ))}
      </Body>
    </div>
  );
};
