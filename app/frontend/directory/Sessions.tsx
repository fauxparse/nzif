import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { groupBy, values } from 'lodash-es';
import { DateTime } from 'luxon';

import Button from '@/atoms/Button';
import { Scalars, useDirectoryQuery } from '@/graphql/types';

import { ROUTES } from './Routes';

type Slot = {
  id: Scalars['ID'];
  startsAt: DateTime;
};

type Day = {
  date: DateTime;
  slots: Slot[];
};

const Sessions: React.FC = () => {
  const { data } = useDirectoryQuery();

  const days = useMemo<Day[]>(
    () =>
      values(groupBy(data?.festival?.slots || [], (slot) => slot.startsAt.toISODate())).map(
        (slots) => ({ date: slots[0].startsAt.startOf('day'), slots })
      ),
    [data]
  );

  return (
    <div className="sessions">
      {days.map((day) => (
        <Fragment key={day.date.toISODate()}>
          <h2>{day.date.plus(0).toFormat('EEEE d MMMM')}</h2>
          {day.slots.map((slot) => (
            <Button
              secondary
              as={Link}
              key={slot.id}
              to={ROUTES.DIRECTORY.TIMESLOT.buildPath({
                timeslot: slot.startsAt.toFormat('y-MM-dd-HHmm'),
              })}
              icon="calendar"
              text={slot.startsAt.toLocaleString(DateTime.TIME_SIMPLE)}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default Sessions;
