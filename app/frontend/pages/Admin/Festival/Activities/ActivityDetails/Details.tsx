import { Fragment, useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import { capitalize, map, snakeCase } from 'lodash-es';
import pluralize from 'pluralize';

import ROLES from '../../../../../../../config/roles.yml';
import Input from '@/atoms/Input';
import {
  ActivityAttributes,
  ActivityDetailsQuery,
  ActivityPresenterFragmentDoc,
  useUpdateActivityDescriptionMutation,
  useUpdateActivityMutation,
} from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import usePresenters from '@/hooks/usePresenters';
import PersonPicker from '@/molecules/PersonPicker';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';

type DetailsProps = {
  activity: ActivityDetailsQuery['festival']['activity'];
};

const Details: React.FC<DetailsProps> = ({ activity }) => {
  const roles = ROLES.roles.activities[snakeCase(activity?.type || '')]?.activity || [];

  const { cache } = useApolloClient();

  const [updateActivity] = useUpdateActivityMutation();

  const updatePresenters = (presenters: Profile[]) =>
    activity?.id
      ? updateActivity({
          variables: {
            id: activity.id,
            attributes: {
              profileIds: map(presenters, 'id'),
            } as ActivityAttributes,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateActivity: {
              __typename: 'UpdateActivityPayload',
              activity: {
                ...activity,
                presenters: presenters.map((presenter) => ({
                  __typename: 'Person',
                  ...presenter,
                })),
              },
            },
          },
        })
      : Promise.reject();

  const { handleSearchPresenters, handleCreatePresenter: createPresenter } = usePresenters();

  const handleCreatePresenter = (profile: Profile) =>
    activity && profile
      ? createPresenter(profile).then((profile: Profile) => {
          const ref = cache.writeFragment({
            fragment: ActivityPresenterFragmentDoc,
            id: cache.identify({ __typename: 'Person', ...profile }),
            data: profile,
          });
          cache.modify({
            id: cache.identify(activity),
            fields: {
              presenters: (existing: Profile[] = []) => [...existing, ref],
            },
          });
          return profile;
        })
      : Promise.reject();

  const descriptionTimeout = useRef<number>();

  const [updateDescription] = useUpdateActivityDescriptionMutation();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    clearTimeout(descriptionTimeout.current);

    if (!activity) return;

    const description = e.currentTarget.value;

    descriptionTimeout.current = window.setTimeout(() => {
      updateDescription({
        variables: {
          id: activity.id,
          description,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateActivity: {
            __typename: 'UpdateActivityPayload',
            activity: {
              ...activity,
              description: e.target.value,
            },
          },
        },
      });
    }, 2000);
  };

  return (
    <div className="inset">
      <div className="activity-details-form">
        {roles.map((role: string) => (
          <Fragment key={role}>
            <label htmlFor="presenters">
              {pluralize(capitalize(role), activity?.presenters?.length || 1)}
            </label>
            <PersonPicker
              value={activity?.presenters || []}
              onChange={updatePresenters}
              onSearch={handleSearchPresenters}
              onCreate={handleCreatePresenter}
            />
          </Fragment>
        ))}

        <label htmlFor="activity-description">Description</label>
        <AutoResize>
          <Input
            as="textarea"
            name="description"
            id="activity-description"
            defaultValue={activity?.description || ''}
            onInput={handleDescriptionChange}
          />
        </AutoResize>
      </div>
    </div>
  );
};

export default Details;
