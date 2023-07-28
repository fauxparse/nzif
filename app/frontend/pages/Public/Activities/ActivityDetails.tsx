import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { uniqBy, upperFirst } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import {
  ActivityDetailsQuery,
  Placename as PlacenameType,
  useActivityDetailsQuery,
} from '@/graphql/types';
import Markdown from '@/helpers/Markdown';
import Skeleton from '@/helpers/Skeleton';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Callout from '@/molecules/Callout';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';
import { activityTypeFromPluralized, Pluralized } from '@/util/activityTypeLabel';
import sentence from '@/util/sentence';

import './Activities.css';

type PresenterLocation = { city: PlacenameType; country: PlacenameType; local: boolean };

type Activity = ActivityDetailsQuery['festival']['activity'];

type Show = Extract<Activity, { __typename: 'Show' }>;

type Workshop = Extract<Activity, { __typename: 'Workshop' }>;

type ShowWithBookingLink = Show & { bookingLink: string };

type ShowWithWorkshop = Show & { workshop: NonNullable<Show['workshop']> };

type WorkshopWithShow = Workshop & { show: NonNullable<Workshop['show']> };

const hasBookingLink = (activity: Activity | null | undefined): activity is ShowWithBookingLink =>
  !!activity && 'bookingLink' in activity && !!activity.bookingLink;

const hasAttachedWorkshop = (activity: Activity | null | undefined): activity is ShowWithWorkshop =>
  !!activity && 'workshop' in activity && !!activity.workshop;

const hasAttachedShow = (activity: Activity | null | undefined): activity is WorkshopWithShow =>
  !!activity && 'show' in activity && !!activity.show;

export const Component: React.FC = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ACTIVITY);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  const { loading, data } = useActivityDetailsQuery({ variables: { type, slug } });

  const activity = data?.festival?.activity;

  const presenters = useMemo(() => activity?.presenters || [], [activity]);

  const places = useMemo(
    () =>
      uniqBy(
        presenters
          .map(({ city, country }) => ({
            city,
            country,
            local: country?.id === 'NZ' || country?.id === 'AU',
          }))
          .filter((p) => p.city && p.country) as PresenterLocation[],
        ({ city, country }) => `${city.id}|${country.id}`
      ),
    [presenters]
  );

  const venue = activity?.sessions?.[0]?.venue;

  return (
    <BreadcrumbProvider label={upperFirst(pluralizedType.replace(/-/g, ' '))} path={pluralizedType}>
      <div className="activity-details page">
        <PageHeader>
          {activity?.picture && (
            <>
              <img
                src={activity.picture.large}
                alt=""
                role="presentation"
                className="activity-details__picture"
              />
            </>
          )}
          <div className="activity-details__breadcrumbs">
            <Breadcrumbs />
          </div>
          <h1>
            <Skeleton text loading={loading}>
              {activity?.name || 'Loading…'}
            </Skeleton>
          </h1>
          <div className="activity-details__presenters">
            <p>{sentence(presenters.map((p) => p.name))}</p>
            <div>
              {places.map(({ city, country, local }) => (
                <Placename
                  key={city.id}
                  name={local ? city.name : `${city.name}, ${country.name}`}
                  traditionalName={
                    city.traditionalName
                      ? local
                        ? city.traditionalName
                        : `${city.traditionalName}, ${country.traditionalName || country.name}`
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </PageHeader>
        <div className="activity-details__main">
          <div className="activity-details__content">
            {activity?.description && (
              <Markdown className="activity-details__description">{activity.description}</Markdown>
            )}
            {loading && (
              <>
                <Skeleton paragraph loading />
                <Skeleton paragraph loading />
              </>
            )}
            {hasAttachedWorkshop(activity) && (
              <Callout className="activity-details__attached">
                This show is cast at least in part from the accompanying workshop,{' '}
                <Link
                  to={ROUTES.ACTIVITY.buildPath({
                    type: 'workshops',
                    slug: activity.workshop.slug,
                  })}
                >
                  {activity.workshop.name}
                </Link>
                . Please note that any such casting is at the discretion of the show’s director and
                is not guaranteed.
              </Callout>
            )}
            {hasAttachedShow(activity) && (
              <Callout className="activity-details__attached">
                Participants from this workshop may be invited to perform in the show,{' '}
                <Link
                  to={ROUTES.ACTIVITY.buildPath({
                    type: 'shows',
                    slug: activity.show.slug,
                  })}
                >
                  {activity.show.name}
                </Link>
                , on {activity.show.sessions[0].startsAt.plus(0).toFormat('EEEE d MMMM')}. Please
                note that any such casting is at the discretion of the show’s director and is not
                guaranteed.
              </Callout>
            )}
          </div>
          <aside className="activity-details__at-a-glance">
            <dl>
              <dt>
                <Icon name="calendar" aria-label="Date and time" />
              </dt>
              {(activity?.sessions || []).map((session) => (
                <dd key={session.id}>
                  {`${session.startsAt
                    .plus(0)
                    .toFormat('EEEE d MMMM, h:mma')}–${session.endsAt.toFormat('h:mma')}`}
                </dd>
              ))}
              {loading && (
                <Skeleton text loading>
                  Loading date and time…
                </Skeleton>
              )}
              {(loading || venue) && (
                <>
                  <dt>
                    <Icon name="location" aria-label="Location" />
                  </dt>
                  <dd>
                    {loading ? (
                      <Skeleton text loading>
                        Loading venue…
                      </Skeleton>
                    ) : (
                      venue && [venue.room, venue.building].filter(Boolean).join(' at ')
                    )}
                  </dd>
                </>
              )}
              {hasBookingLink(activity) && (
                <>
                  <dt>
                    <Icon name="show" aria-label="Booking link" />
                  </dt>
                  <dd>
                    <Button
                      small
                      primary
                      as="a"
                      href={activity.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book at BATS
                    </Button>
                  </dd>
                </>
              )}
            </dl>
          </aside>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'ActivityDetails';

export default Component;
