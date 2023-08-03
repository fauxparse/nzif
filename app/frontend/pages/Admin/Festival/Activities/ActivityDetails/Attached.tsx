import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/atoms/Button';
import {
  ActivityAttributes,
  ActivitySearchQuery,
  ActivityType,
  useActivitySearchLazyQuery,
  useUpdateActivityMutation,
} from '@/graphql/types';
import { ROUTES } from '@/Routes';
import { pluralizeActivityType } from '@/util/activityTypeLabel';

import useActivity from './useActivity';

const PAIRS: Partial<Record<ActivityType, ActivityType>> = {
  [ActivityType.Show]: ActivityType.Workshop,
  [ActivityType.Workshop]: ActivityType.Show,
} as const;

export const Component: React.FC = () => {
  const { loading, activity } = useActivity();

  const [findMatchingActivity, { data, loading: searching }] = useActivitySearchLazyQuery();

  const attached =
    activity?.__typename === 'Show'
      ? activity.workshop
      : activity?.__typename === 'Workshop'
      ? activity.show
      : null;

  useEffect(() => {
    if (attached || !activity || !PAIRS[activity.type]) return;
    findMatchingActivity({
      variables: {
        activityType: PAIRS[activity.type] as ActivityType,
        query: activity.name,
      },
    });
  }, [attached, activity, findMatchingActivity]);

  const [update] = useUpdateActivityMutation();

  const detach = () => {
    if (!activity) return;

    update({
      variables: {
        id: activity.id,
        attributes: {
          attachedActivityId: null,
        } as ActivityAttributes,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateActivity: {
          __typename: 'UpdateActivityPayload',
          activity: {
            ...activity,
            [activity.type === ActivityType.Show ? 'workshop' : 'show']: null,
          },
        },
      },
    });
  };

  const attach = () => {
    if (!activity || !data?.search?.length) return;

    const attachedActivity = (
      data.search[0] as ActivitySearchQuery['search'][0] & {
        __typename: 'ActivityResult';
      }
    ).activity;

    update({
      variables: {
        id: activity.id,
        attributes: {
          attachedActivityId: attachedActivity.id,
        } as ActivityAttributes,
      },
    });
  };

  return (
    <div className="attached-activity">
      {attached ? (
        <>
          <Button
            primary
            as={Link}
            to={ROUTES.ADMIN.ACTIVITY.buildPath({
              type: pluralizeActivityType(attached.type),
              slug: attached.slug,
            })}
            text={attached.name}
          />
          <Button ghost text="Detach" onClick={detach} />
        </>
      ) : (
        <div>
          {loading || searching ? (
            'Loading...'
          ) : data?.search?.length ? (
            <Button primary text={`Attach ${data.search[0].title}`} onClick={attach} />
          ) : (
            <p>No matching activities found</p>
          )}
        </div>
      )}
    </div>
  );
};

Component.displayName = 'Attached';

export default Component;
