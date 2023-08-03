import { Link, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import Button from '@/atoms/Button';
import {
  useActivityDetailsQuery,
  useMoveActivityMutation,
  useRenameActivityMutation,
} from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';
import { useToaster } from '@/molecules/Toaster';
import { ROUTES } from '@/Routes';
import activityTypeLabel, {
  activityTypeFromPluralized,
  Pluralized,
} from '@/util/activityTypeLabel';

import '../Activities.css';
import './ActivityDetails.css';

export const Component: React.FC = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ADMIN.ACTIVITY);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  const location = useLocation();

  const date = location.pathname.match(/\/(\d{4}-\d{2}-\d{2})($|\/)/)?.[1];

  const navigate = useNavigate();

  const { data, loading } = useActivityDetailsQuery({ variables: { type, slug } });

  const activity = data?.festival?.activity;

  const urlPrefix = `${window.location.origin}/${pluralize(kebabCase(type))}/`;

  const [rename] = useRenameActivityMutation();
  const [move] = useMoveActivityMutation();

  const handleRename = (name: string) => {
    if (!activity) return;

    return rename({
      variables: {
        id: activity.id,
        name,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        renameActivity: {
          __typename: 'RenameActivityPayload',
          activity: {
            ...activity,
            name,
          },
        },
      },
    }).then(({ data }) => {
      const renamed = data?.renameActivity?.activity;
      if (!renamed) return activity.name;
      if (slug !== renamed.slug && renamed.slug) {
        navigate(`../${renamed.slug}`, { replace: true });
      }
      return renamed.name;
    });
  };

  const handleMove = (newSlug: string) => {
    if (!activity) return;

    return move({
      variables: {
        id: activity.id,
        slug: newSlug,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        moveActivity: {
          __typename: 'MoveActivityPayload',
          activity: {
            ...activity,
            slug: newSlug,
          },
        },
      },
    }).then(({ data }) => {
      const moved = data?.moveActivity?.activity;
      if (!moved) return activity.slug;
      if (slug !== moved.slug && moved.slug) {
        navigate(`../${moved.slug}`, { replace: true });
      }
      return moved.slug;
    });
  };

  const { notify } = useToaster();

  const copyURL = () => {
    navigator.clipboard
      .writeText(`${urlPrefix}${activity?.slug}`)
      .then(() => notify('URL copied to clipboard'));
  };

  return (
    <BreadcrumbProvider
      path={pluralize(kebabCase(type))}
      label={pluralize(activityTypeLabel(type))}
    >
      <div className="page">
        <PageHeader>
          <Breadcrumbs />
          <h1>
            {loading || !activity ? (
              'Loading…'
            ) : (
              <InPlaceEdit value={activity.name} onChange={handleRename} />
            )}
          </h1>
          {activity && (
            <div className="url-editor">
              <span className="url-editor__prefix">{urlPrefix}</span>
              <InPlaceEdit value={activity.slug} onChange={handleMove} />
              <Button
                className="url-editor__copy"
                ghost
                icon="clipboard"
                aria-label="Copy"
                onClick={copyURL}
              />
            </div>
          )}
          {activity && (
            <Tabs>
              <Tabs.Tab as={Link} to="." text="Details" selected={!date} />
              {activity?.sessions?.map((session) => (
                <Tabs.Tab
                  key={session.id}
                  as={Link}
                  to={session.startsAt.toISODate() || ''}
                  text={session.startsAt.plus(0).toFormat('cccc d')}
                  selected={date === session.startsAt.toISODate()}
                />
              ))}
            </Tabs>
          )}
        </PageHeader>
        <Outlet />
      </div>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'ActivityDetails';
