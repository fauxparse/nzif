import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import ROLES from '@config/roles.yml';
import { zodResolver } from '@hookform/resolvers/zod';
import { capitalize, map, pick, pull, snakeCase } from 'lodash-es';
import pluralize from 'pluralize';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  ActivityAttributes,
  ActivityDetailsQuery,
  ActivityPresenterFragmentDoc,
  useUpdateActivityMutation,
} from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import Labelled from '@/helpers/Labelled';
import usePresenters from '@/hooks/usePresenters';
import PersonPicker from '@/molecules/PersonPicker';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';
import { useToaster } from '@/molecules/Toaster';

type DetailsProps = {
  activity: ActivityDetailsQuery['festival']['activity'];
};

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  presenters: z.array(z.object({ id: z.string(), name: z.string() })),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Details: React.FC<DetailsProps> = ({ activity }) => {
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
      presenters: activity?.presenters || [],
    },
  });

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
    <div className="inset">
      <form className="details-form" onSubmit={handleSubmit(onSubmit)}>
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
              <Input as="textarea" id="description" {...register('description')} />
            </AutoResize>
          </Labelled>
        </section>

        <section className="details-form__buttons">
          <Button primary type="submit" text="Save changes" disabled={!isDirty} />
        </section>
      </form>
    </div>
  );
};

export default Details;
