import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import ROLES from '@config/roles.yml';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize, isEmpty, map, pick, pull, snakeCase } from 'lodash-es';
import pluralize from 'pluralize';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  ActivityAttributes,
  ActivityPresenterFragmentDoc,
  ActivityType,
  useUpdateActivityMutation,
} from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import Labelled from '@/helpers/Labelled';
import usePresenters from '@/hooks/usePresenters';
import PersonPicker from '@/molecules/PersonPicker';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';
import { useToaster } from '@/molecules/Toaster';

import ActivityPicture from './ActivityPicture';
import PresenterForm from './PresenterForm';
import useActivity from './useActivity';

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  suitability: z.string(),
  bookingLink: z.string().optional(),
  presenters: z.array(z.object({ id: z.string(), name: z.string() })),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Component: React.FC = () => {
  const { loading, activity } = useActivity();

  const roles = ROLES.roles.activities[snakeCase(activity?.type || '')]?.activity || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    getValues,
    setValue,
    reset,
  } = useForm<FormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activity?.name || '',
      description: activity?.description || '',
      suitability: (activity && 'suitability' in activity && activity.suitability) || '',
      presenters: activity?.presenters || [],
      bookingLink: activity?.bookingLink || '',
    },
  });

  useEffect(() => {
    if (!activity) return;

    setValue('name', activity.name || '');
    setValue('description', activity.description || '');
    setValue('bookingLink', activity.bookingLink || '');
    if (activity.__typename === 'Workshop') setValue('suitability', activity.suitability || '');
  }, [activity, setValue]);

  const { cache } = useApolloClient();

  const [updateActivity] = useUpdateActivityMutation();

  const { notify } = useToaster();

  const onSubmit = async (allAttributes: FormSchemaType) => {
    if (!activity) return;

    const attributes = pick(
      allAttributes,
      pull(Object.keys(dirtyFields), 'presenters')
    ) as ActivityAttributes;

    if (dirtyFields.presenters) {
      attributes.profileIds = map(getValues('presenters'), 'id');
    }

    if (isEmpty(attributes)) return;

    const result = await updateActivity({
      variables: {
        id: activity.id,
        attributes,
      },
    });

    const saved = result.data?.updateActivity?.activity;

    if (saved) {
      notify('Changes saved');

      reset({
        name: saved.name || '',
        description: saved.description || '',
        suitability: ('suitability' in saved && saved.suitability) || '',
        presenters: saved.presenters || [],
      });
    }
  };

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

  const setPresenters = (presenters: Profile[]) =>
    setValue('presenters', presenters, { shouldDirty: true });

  return (
    <>
      <div className="inset">
        <div className="details-form" onSubmit={handleSubmit(onSubmit)}>
          <form id="activity-details" style={{ display: 'contents' }}>
            <section>
              <header>
                <h3>Activity details</h3>
              </header>
              {roles.map((role: string) => (
                <Fragment key={role}>
                  <Labelled
                    name="presenters"
                    label={pluralize(capitalize(role), activity?.presenters?.length || 1)}
                    errors={errors}
                  >
                    <PersonPicker
                      value={activity?.presenters || []}
                      onChange={setPresenters}
                      onSearch={handleSearchPresenters}
                      onCreate={handleCreatePresenter}
                    />
                  </Labelled>
                </Fragment>
              ))}

              <Labelled name="description" label="Description" errors={errors}>
                <AutoResize>
                  <Input
                    as="textarea"
                    id="description"
                    {...register('description')}
                    disabled={loading || undefined}
                  />
                </AutoResize>
              </Labelled>

              {activity?.type === ActivityType.Workshop && (
                <Labelled name="suitability" label="Suitable for" errors={errors}>
                  <AutoResize>
                    <Input
                      as="textarea"
                      id="suitability"
                      {...register('suitability')}
                      disabled={loading || undefined}
                    />
                  </AutoResize>
                </Labelled>
              )}

              {activity?.type === ActivityType.Show && (
                <Labelled name="bookingLink" label="Booking link" errors={errors}>
                  <Input
                    type="url"
                    id="bookingLink"
                    {...register('bookingLink')}
                    disabled={loading || undefined}
                  />
                </Labelled>
              )}
            </section>

            {activity && (
              <section>
                <header>
                  <h3>Image</h3>
                </header>
                <ActivityPicture activity={activity} />
              </section>
            )}
          </form>

          {roles.map((role: string) => (
            <section key={role} className="activity-tutors">
              <header>
                <h3>{pluralize(capitalize(role), activity?.presenters?.length || 1)}</h3>
              </header>
              {activity?.presenters?.map((presenter) => (
                <PresenterForm key={JSON.stringify(presenter)} presenter={presenter} />
              ))}
            </section>
          ))}
        </div>
      </div>
      <footer className="details-form__buttons">
        <Button
          primary
          type="submit"
          form="activity-details"
          text="Save changes"
          disabled={!isDirty}
        />
      </footer>
    </>
  );
};

export default Component;
