import Placename from '@/components/atoms/Placename';
import Skeleton, { ParagraphSkeleton } from '@/components/helpers/Skeleton';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { ResultOf, graphql, readFragment } from '@/graphql';
import { usePlacenames } from '@/hooks/usePlacenames';
import CalendarIcon from '@/icons/CalendarIcon';
import LocationIcon from '@/icons/LocationIcon';
import { Container, Image } from '@mantine/core';
import { map, range, uniqBy } from 'lodash-es';

import Avatar from '@/components/atoms/Avatar';
import ShareButton from '@/components/atoms/ShareButton';
import Markdown from '@/components/helpers/Markdown';
import ShowIcon from '@/icons/ShowIcon';
import { Fragment } from 'react';
import './ActivityDetails.css';

const ActivityPresenterFragment = graphql(`
  fragment ActivityPresenter on Person {
    id
    name
    bio
    city {
      id
      name
      traditionalName
    }
    country {
      id
      name
      traditionalName
    }
    picture {
      id
      medium
    }
  }
`);

export const ActivityDetailsQuery = graphql(
  `#graphql
  query ActivityDetails($year: String!, $type: ActivityType!, $slug: String!) {
    festival(year: $year) {
      id

      activity(type: $type, slug: $slug) {
        id
        type
        name
        description
        bookingLink

        presenters {
          ...ActivityPresenter
        }

        picture {
          id
          large
          blurhash
        }

        sessions {
          id
          startsAt
          endsAt

          venue {
            id
            room
            building
          }
        }
      }
    }
  }
`,
  [ActivityPresenterFragment]
);

type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;

type ActivityDetailsProps = {
  activity: Activity;
  loading?: boolean;
};

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, loading }) => {
  const activityName = loading ? <Skeleton height="1em" width="12em" /> : activity.name;
  const activityPresenters = readFragment(ActivityPresenterFragment, activity.presenters);
  const placenames = usePlacenames(activityPresenters);
  const venues = uniqBy(map(activity.sessions, 'venue').filter(Boolean), 'id');

  return (
    <Container>
      <Header
        className="activity-details__header"
        background={
          !loading && activity.picture?.large
            ? {
                src: activity.picture.large,
                blurhash: activity.picture.blurhash,
              }
            : undefined
        }
        data-color={loading ? 'neutral' : 'magenta'}
        actions={
          <>
            <ShareButton />
          </>
        }
        title={
          <>
            <h1>{activityName}</h1>
            <div className="presenters">
              {loading ? (
                <Skeleton height="1em" width="12em" />
              ) : (
                activityPresenters.map((presenter) => presenter.name).join(', ')
              )}
            </div>
            <div className="placenames">
              {loading ? (
                <Skeleton height="1.5em" width="8em" radius="0.75em" />
              ) : (
                placenames.map((placename) => <Placename key={placename.id} {...placename} />)
              )}
            </div>
          </>
        }
      />
      <Body className="activity-details__body">
        <div className="activity-details__content">
          <aside className="activity-details__aside">
            {loading ? (
              <dl>
                {range(3).map((i) => (
                  <Fragment key={i}>
                    <dt>
                      <Skeleton circle width="var(--icon-medium)" height="var(--icon-medium)" />
                    </dt>
                    <dd>
                      <Skeleton height="1em" width="12em" />
                    </dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <dl>
                {loading ||
                  (activity.sessions.length > 0 && (
                    <>
                      <dt>
                        <CalendarIcon />
                      </dt>
                      {activity.sessions.map((session) => (
                        <dd key={session.id}>
                          {session.startsAt.plus({}).toFormat('h:mma EEEE d MMMM')}
                        </dd>
                      ))}
                    </>
                  ))}
                {venues.length > 0 && (
                  <>
                    <dt>
                      <LocationIcon />
                    </dt>
                    {venues.map(
                      (venue) =>
                        !!venue && (
                          <dd key={venue.id}>
                            {[venue.room, venue.building].filter(Boolean).join(' at ')}
                          </dd>
                        )
                    )}
                  </>
                )}
                {activity.bookingLink && (
                  <>
                    <dt>
                      <ShowIcon />
                    </dt>
                    <dd>
                      <a href={activity.bookingLink} target="_blank" rel="noreferrer">
                        Book now
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            )}
          </aside>
          <div className="activity-details__description">
            {loading ? (
              <>
                <Skeleton className="activity-details__picture" style={{ aspectRatio: '16 / 9' }} />
                <ParagraphSkeleton />
                <div className="activity-details__presenter">
                  <Skeleton
                    circle
                    className="avatar"
                    width="var(--avatar-xl)"
                    height="var(--avatar-xl)"
                  />
                  <h3>
                    <Skeleton height="1em" width="12em" />
                  </h3>
                  <div>
                    <ParagraphSkeleton />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Image
                  className="activity-details__picture"
                  src={activity.picture?.large}
                  alt={activity.name}
                />

                <Markdown>{String(activity.description)}</Markdown>

                {activityPresenters.map((presenter) => (
                  <div className="activity-details__presenter" key={presenter.id}>
                    <Avatar size="xl" user={{ profile: presenter }} />
                    <h3>{presenter.name}</h3>
                    <Markdown>{presenter.bio}</Markdown>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Body>
    </Container>
  );
};

export default ActivityDetails;
