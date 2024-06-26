import { uniqBy, upperFirst } from 'lodash-es';
import { Fragment, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import {
  ActivityDetailsQuery,
  ActivityType,
  Permission,
  Placename as PlacenameType,
  useActivityDetailsQuery,
} from '@/graphql/types';
import Markdown from '@/helpers/Markdown';
import ScrollToTop from '@/helpers/ScrollToTop';
import Skeleton from '@/helpers/Skeleton';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Callout from '@/molecules/Callout';
import PageHeader from '@/molecules/PageHeader';
import { useAuthentication } from '@/organisms/Authentication';
import {
  Pluralized,
  activityTypeFromPluralized,
  adminActivityLink,
} from '@/util/activityTypeLabel';
import sentence from '@/util/sentence';

import PresenterPlacename from './PresenterPlacename';
import ShowCasts from './ShowCasts';

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

const hasSuitability = (activity: Activity | null | undefined): activity is Workshop =>
  !!activity && 'suitability' in activity && !!activity.suitability;

const isShow = (activity: Activity | null | undefined): activity is Show =>
  !!activity && activity.__typename === ActivityType.Show;

export const Component: React.FC = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ACTIVITY);

  const { hasPermission } = useAuthentication();

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

  return (
    <BreadcrumbProvider label={upperFirst(pluralizedType.replace(/-/g, ' '))} path={pluralizedType}>
      <div className="activity-details page">
        <ScrollToTop />
        {activity && (
          <Helmet>
            <title>NZIF: {activity.name}</title>
          </Helmet>
        )}
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
            {activity && hasPermission(Permission.Activities) && (
              <Button
                small
                primary
                as={Link}
                to={adminActivityLink(activity)}
                icon="edit"
                text="Edit"
              />
            )}
          </div>
          <h1>
            <Skeleton text loading={loading}>
              {activity?.name || 'Loading…'}
            </Skeleton>
          </h1>
          <div className="activity-details__presenters">
            <p>{sentence(presenters.map((p) => p.name))}</p>
            <div>
              {places.map(({ city, country }) => (
                <PresenterPlacename key={city.id} city={city} country={country} />
              ))}
            </div>
          </div>
        </PageHeader>
        <div className="activity-details__main">
          <div className="activity-details__content">
            {loading ? (
              <>
                <Skeleton paragraph loading />
                <Skeleton paragraph loading />
              </>
            ) : (
              <>
                {activity?.description && (
                  <Markdown className="activity-details__description">
                    {activity.description}
                  </Markdown>
                )}
                {hasSuitability(activity) && (
                  <>
                    <h4>Who’s it for?</h4>
                    <Markdown className="activity-details__suitability">
                      {activity.suitability}
                    </Markdown>
                  </>
                )}
                {isShow(activity) && <ShowCasts show={activity} />}
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

            {activity?.presenters?.map((presenter) => (
              <div key={presenter.id} className="activity-details__presenter">
                <Avatar large name={presenter.name} url={presenter.picture?.large} />
                <div>
                  <h4>
                    {presenter.name} <PresenterPlacename {...presenter} />
                  </h4>
                  {presenter.bio && <Markdown>{presenter.bio}</Markdown>}
                </div>
              </div>
            ))}
          </div>
          <aside className="activity-details__at-a-glance">
            <dl>
              {(activity?.sessions || []).map((session, i) => (
                <Fragment key={session.id}>
                  {i > 0 && <div className="activity-details__divider">and</div>}
                  <dt>
                    <Icon name="calendar" aria-label="Date and time" />
                  </dt>
                  <dd key={session.id}>
                    {`${session.startsAt
                      .plus(0)
                      .toFormat('EEEE d MMMM, h:mma')}–${session.endsAt.toFormat('h:mma')}`}
                  </dd>
                  {session.venue && (
                    <>
                      <dt>
                        <Icon name="location" aria-label="Location" />
                      </dt>
                      <dd>
                        {[session.venue.room, session.venue.building].filter(Boolean).join(' at ')}
                      </dd>
                    </>
                  )}
                </Fragment>
              ))}

              {loading && (
                <Skeleton text loading>
                  Loading date and time…
                </Skeleton>
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
