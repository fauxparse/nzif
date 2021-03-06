import React, { Fragment } from 'react'
import PropTypes from 'lib/proptypes'
import Link from 'atoms/text_link'
import Date from 'atoms/date'

const AssociatedShow = ({ name, url, session }) => (
  <>
    Participants in this workshop may be considered for casting in the show{' '}
    <Link to={url}>{name}</Link>, on <Date date={session.startsAt} />.
  </>
)

AssociatedShow.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  session: PropTypes.session.isRequired,
}

const AssociatedWorkshop = ({ name, url, session }) => (
  <>
    This show will be cast from the associated workshop,{' '}
    <Link to={url}>{name}</Link>, on <Date date={session.startsAt} />.
  </>
)

AssociatedWorkshop.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  session: PropTypes.session.isRequired,
}

const Associated = ({ type, name, url, sessions }) => {
  const session = sessions[0]
  const Content = type === 'show' ? AssociatedShow : AssociatedWorkshop
  return session ? (
    <div className={`associated associated--${type}`}>
      <Content {...{ name, url, session }} />
    </div>
  ) : (
    <Fragment />
  )
}

Associated.propTypes = {
  type: PropTypes.activityType.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sessions: PropTypes.array.isRequired
}

export default Associated
