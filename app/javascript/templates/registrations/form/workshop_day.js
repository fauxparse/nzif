import React, { useMemo } from 'react'
import PropTypes from 'lib/proptypes'
import moment from 'lib/moment'
import entries from 'lodash/entries'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import Day from 'molecules/day'
import Timeslot from './workshop_timeslot'

const WorkshopDay = ({
  date,
  loading,
  sessions,
  offset,
  ordering,
  onToggleActivity,
  onSelectActivity,
}) => {
  const slots = useMemo(() => (
    sortBy(
      entries(groupBy(sessions, session => session.startsAt.valueOf())),
      [([time]) => time]
    ).map(([time, activities]) => [moment(parseInt(time, 10)), activities])
  ), [sessions])

  return (
    <Day date={date} offset={offset}>
      {slots.map(([time, sessions]) => (
        <Timeslot
          key={time.valueOf()}
          time={time}
          offset={offset}
          loading={loading}
          sessions={sessions}
          ordering={ordering}
          onToggleActivity={onToggleActivity}
          onSelectActivity={onSelectActivity}
        />
      ))}
    </Day>
  )
}

WorkshopDay.propTypes = {
  date: PropTypes.time.isRequired,
  loading: PropTypes.bool,
  sessions: PropTypes.arrayOf(PropTypes.session.isRequired).isRequired,
  offset: PropTypes.number,
  ordering:
    PropTypes.objectOf(PropTypes.arrayOf(PropTypes.id.isRequired).isRequired).isRequired,
  onToggleActivity: PropTypes.func.isRequired,
  onSelectActivity: PropTypes.func.isRequired,
}

export default WorkshopDay
