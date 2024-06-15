import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { createFormFactory } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { isEmpty, isEqual, pick } from 'lodash-es';
import { useRef } from 'react';
import { Presenters } from './Presenters';
import { ActivityDetailsQuery, UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails, WithUploadedPicture, isShow } from './types';

type EditProps = {
  activity: Activity;
};

const formFactory = createFormFactory<WithUploadedPicture<ActivityDetails>>({
  defaultValues: {
    name: '',
    type: ActivityType.Workshop,
    slug: '',
    description: '',
    presenters: [],
    uploadedPicture: null,
  },
});

const getDefaultValuesFromActivity = (activity: Activity): ActivityDetails => {
  return pick(activity, ['name', 'type', 'slug', 'description', 'presenters']) as ActivityDetails;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const festival = useFestival();

  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = true;

  const lastSaved = useRef<
    Activity | NonNullable<ResultOf<typeof UpdateActivityMutation>['updateActivity']>['activity']
  >(activity);

  const form = formFactory.useForm({
    defaultValues: { ...getDefaultValuesFromActivity(activity), uploadedPicture: null },
    onSubmit: async ({ value }) => {
      const attributes = {} as ActivityAttributes;

      if (value.description !== lastSaved.current.description) {
        attributes.description = value.description;
      }

      const previousIds = lastSaved.current.presenters.map((presenter) => presenter.id);
      const newIds = value.presenters.map((presenter) => presenter.id);
      if (!isEqual(previousIds, newIds)) {
        attributes.profileIds = newIds;
      }

      if (value.uploadedPicture && form.state.fieldMeta.uploadedPicture.isDirty) {
        attributes.uploadedPicture = value.uploadedPicture;
      }

      if (isEmpty(attributes)) return;

      await updateMutation({
        variables: {
          id: activity.id,
          attributes,
        },
        update: (cache, { data }) => {
          const variables = { year: festival.id, type: activity.type, slug: activity.slug };
          const current = cache.readQuery({ query: ActivityDetailsQuery, variables });
          if (!current?.festival?.activity || !data?.updateActivity?.activity) return;
          cache.writeQuery({
            query: ActivityDetailsQuery,
            variables,
            data: {
              ...current,
              festival: {
                ...current.festival,
                activity: {
                  ...current.festival.activity,
                  ...data.updateActivity.activity,
                },
              },
            },
          });
        },
      }).then(({ data }) => {
        if (data?.updateActivity?.activity) {
          lastSaved.current = data.updateActivity.activity;
          notifications.show({ message: 'Changes saved' });
          form.setFieldValue('uploadedPicture', null);
        }
      });
    },
  });

  return (
    <div className="activity-editor__edit">
      <form.Field name="description">
        {(field) => (
          <Editor
            value={field.state.value || ''}
            onChange={(value) => {
              if (value === field.state.value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      {hasPresenters && (
        <form.Field name="presenters">
          {(field) => (
            <Presenters
              title={isShow(activity) ? 'Directors' : 'Tutors'}
              presenters={field.state.value}
              onAddPresenter={(presenter) => {
                field.pushValue(presenter);
                form.handleSubmit();
              }}
              onRemovePresenter={(presenter) => {
                field.handleChange((current) => current.filter((p) => p.id !== presenter.id));
                form.handleSubmit();
              }}
            />
          )}
        </form.Field>
      )}
      <form.Field name="uploadedPicture">
        {(field) => (
          <ImageUploader
            className="activity-editor__picture"
            width={1920}
            height={1080}
            value={activity.picture?.large ?? null}
            onChange={(value) => {
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
    </div>
  );
};
