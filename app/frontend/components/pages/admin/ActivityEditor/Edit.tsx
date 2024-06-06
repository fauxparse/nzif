import { ImageUploader } from '@/components/molecules/ImageUploader';
import { PersonPicker } from '@/components/molecules/PersonPicker';
import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes, ActivityType, UploadedFile } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { createFormFactory } from '@tanstack/react-form';
import { pick } from 'lodash-es';
import { UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails, isShow, isWorkshop } from './types';

type EditProps = {
  activity: Activity;
};

type WithUploadedPicture<T> = T & {
  uploadedPicture: UploadedFile | null;
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
  const result = pick(activity, ['name', 'type', 'slug', 'description']) as ActivityDetails;

  if (isWorkshop(activity)) {
    result.presenters = activity.tutors.map((presenter) => ({
      id: presenter.id,
      name: presenter.name,
    }));
  } else if (isShow(activity)) {
    result.presenters = activity.directors.map((presenter) => ({
      id: presenter.id,
      name: presenter.name,
    }));
  }
  return result;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = isWorkshop(activity) || isShow(activity);

  const form = formFactory.useForm({
    defaultValues: { ...getDefaultValuesFromActivity(activity), uploadedPicture: null },
    onSubmit: async ({ value }) => {
      const attributes = {} as ActivityAttributes;

      if (form.state.fieldMeta.description.isDirty) {
        attributes.description = value.description;
      }

      if (hasPresenters && form.state.fieldMeta.presenters.isDirty) {
        attributes.profileIds = value.presenters.map((presenter) => presenter.id);
      }

      if (value.uploadedPicture && form.state.fieldMeta.uploadedPicture.isDirty) {
        attributes.uploadedPicture = value.uploadedPicture;
      }

      await updateMutation({
        variables: {
          id: activity.id,
          attributes,
        },
        update: (cache, { data }) => {
          if (!data?.updateActivity?.activity) return;

          const updated = data.updateActivity.activity;

          cache.modify({
            id: cache.identify(activity),
            fields: {
              description: () => updated.description,
            },
          });
        },
      }).then(() => {
        notifications.show({ message: 'Changes saved' });
        form.setFieldValue('uploadedPicture', null);
      });
    },
  });

  return (
    <div className="activity-editor__edit">
      {hasPresenters && (
        <form.Field name="presenters">
          {(field) => (
            <PersonPicker
              value={field.state.value}
              allowAdd
              onChange={(value) => {
                field.handleChange(value);
                form.handleSubmit();
              }}
            />
          )}
        </form.Field>
      )}
      <form.Field name="description">
        {(field) => (
          <Editor
            value={field.state.value || ''}
            onChange={(value) => {
              if (field.state.value === value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <form.Field name="uploadedPicture">
        {(field) => (
          <ImageUploader
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
