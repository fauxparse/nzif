import React from 'react'
import PropTypes from 'lib/proptypes'
import pluralize from 'pluralize'
import humanize from 'lib/humanize'
import kebabCase from 'lodash/kebabCase'
import { Picture } from 'react-responsive-picture'
import Helmet from 'react-helmet'
import Skeleton from 'effects/skeleton'
import Divider from 'atoms/divider'
import Breadcrumbs from 'molecules/breadcrumbs'
import Markdown from 'molecules/markdown'
import AssociatedActivity from 'molecules/associated_activity'
import ActivitySession from 'molecules/activity_session'
import Header from 'organisms/header'
import Duotone from 'effects/duotone'
import PresenterBio from './presenter_bio'
import dummy from './dummy'

import './index.scss'

const Details = ({ loading, festival, activity }) => {
  const {
    type,
    name,
    sessions,
    description,
    presenters,
    image,
    associated = [],
  } = (!loading && activity) || dummy()

  const back = `/${festival.year}/${pluralize(kebabCase(type))}`

  return (
    <div className="activity-details">
      {!loading && (
        <Helmet>
          <title>{activity.name}</title>
        </Helmet>
      )}
      <Header colored className="activity-details__header">
        <Breadcrumbs back={back}>
          <Breadcrumbs.Link to={`/${festival.year}`}>NZIF {festival.year}</Breadcrumbs.Link>
          <Breadcrumbs.Link to={back}>{pluralize(humanize(type))}</Breadcrumbs.Link>
        </Breadcrumbs>
        <Skeleton as={Header.Title} loading={loading}>
          {loading ? 'Activity name' : name}
        </Skeleton>
        <Skeleton as="div" className="activity-details__presenter-names" loading={loading}>
          {presenters.map(presenter => (
            <div key={presenter.id} className="presenter-name">
              <span className="presenter-name__name">{presenter.name}</span>
              <span className="presenter-name__origin">{presenter.origin}</span>
            </div>
          ))}
        </Skeleton>
        {image && (
          <Header.Background>
            <Duotone gradient="tomato">
              <Picture
                alt={name}
                sources={[
                  {
                    srcSet: `${image.thumbnail}, ${image.small} 2x`,
                    media: '(max-width: 384px)'
                  },
                  {
                    srcSet: `${image.medium}, ${image.full} 2x`,
                    media: '(max-width: 960px)'
                  },
                  {
                    srcSet: image.full
                  }
                ]}
              />
            </Duotone>
          </Header.Background>
        )}
      </Header>

      <div className="activity-details__body">
        <div className="activity-sessions">
          {sessions.map(session => (
            <Skeleton
              key={session.id}
              as={ActivitySession}
              loading={loading}
              startsAt={session.startsAt}
              endsAt={session.endsAt}
              venue={session.venue}
            />
          ))}
        </div>
        <Divider accent />
        <Skeleton as="div" className="activity-details__description" loading={loading}>
          <Markdown text={description} />
          {associated.map(associated_activity => (
            <AssociatedActivity key={associated_activity.id} activity={associated_activity} />
          ))}
        </Skeleton>
      </div>
      <div className="activity-details__presenters">
        {presenters.map(presenter => (
          <Skeleton
            key={presenter.id}
            as={PresenterBio}
            presenter={presenter}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}

Details.propTypes = {
  loading: PropTypes.bool,
  activity: PropTypes.activity,
  festival: PropTypes.shape({
    year: PropTypes.id.isRequired,
  }).isRequired,
}

Details.defaultProps = {
  loading: false,
  activity: undefined,
}

export default Details
