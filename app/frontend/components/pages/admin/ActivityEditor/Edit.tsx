import { ImageUploader } from '@/components/molecules/ImageUploader';
import { useToast } from '@/components/molecules/Toast';
import { Editor } from '@/components/organisms/Editor';
import { ActivityPicker } from '@/components/organisms/TimetableEditor/ActivityPicker';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { Flex, TextArea } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { get, isEmpty, pick, pickBy } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { Presenters } from './Presenters';
import { UpdateActivityMutation } from './queries';
import {
  Activity,
  ActivityDetails,
  AttachedActivity,
  Presenter,
  WithUploadedPicture,
  isShow,
  isWorkshop,
} from './types';

import classes from './ActivityEditor.module.css';

type EditProps = {
  activity: Activity;
};

type Fields = WithUploadedPicture<ActivityDetails>;

const getDefaultValuesFromActivity = (activity: Activity): ActivityDetails => {
  return pick(activity, ['name', 'type', 'slug', 'description']) as ActivityDetails;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = true;

  const lastSaved = useRef<
    Activity | NonNullable<ResultOf<typeof UpdateActivityMutation>['updateActivity']>['activity']
  >(activity);

  const { notify } = useToast();

  const updatePresenters = (presenters: Presenter[]) => {
    updateMutation({
      variables: {
        id: activity.id,
        attributes: {
          profileIds: presenters.map((p) => p.id),
        },
      },
    }).then(({ data }) => {
      if (data?.updateActivity?.activity) {
        lastSaved.current = data.updateActivity.activity;
      }
    });
  };

  const addPresenter = (presenter: Presenter) => {
    updatePresenters([...activity.presenters, presenter]);
  };

  const removePresenter = (presenter: Presenter) => {
    updatePresenters(activity.presenters.filter((p) => p.id !== presenter.id));
  };

  const [attachedActivity, setAttachedActivity] = useState<AttachedActivity | null>(null);

  useEffect(() => {
    setAttachedActivity(
      isShow(activity)
        ? get(activity, 'workshop')
        : isWorkshop(activity)
          ? get(activity, 'show')
          : null
    );
  }, [activity]);

  const form = useForm({
    defaultValues: {
      ...getDefaultValuesFromActivity(activity),
      uploadedPicture: null,
      pictureAltText: activity.picture?.altText ?? '',
      attachedActivityId: get(activity, 'workshop.id') ?? get(activity, 'show.id') ?? null,
    } as Fields,
    onSubmit: async ({ value, formApi }) => {
      const attributes = pickBy(
        value,
        (_, key) => formApi.getFieldMeta(key as keyof Fields)?.isDirty
      ) as Partial<ActivityAttributes>;

      if (isEmpty(attributes)) return;

      await updateMutation({
        variables: {
          id: activity.id,
          attributes,
        },
      }).then(({ data }) => {
        if (data?.updateActivity?.activity) {
          lastSaved.current = data.updateActivity.activity;
          notify({ description: 'Changes saved' });
          form.reset();
          form.setFieldValue('uploadedPicture', null);
        }
      });
    },
  });

  return (
    <div className={classes.edit}>
      <Flex direction="column" gap="4">
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

        {(isShow(activity) || isWorkshop(activity)) && (
          <form.Field name="attachedActivityId">
            {(field) => (
              <ActivityPicker
                value={attachedActivity}
                placeholder={isShow(activity) ? 'Attached workshop' : 'Attached show'}
                activityType={isShow(activity) ? ActivityType.Workshop : ActivityType.Show}
                onChange={(activity) => {
                  setAttachedActivity(activity);
                  field.handleChange(activity?.id ?? null);
                  form.handleSubmit();
                }}
              />
            )}
          </form.Field>
        )}
      </Flex>
      {hasPresenters && (
        <form.Field name="presenters">
          {(field) => (
            <Presenters
              title={isShow(activity) ? 'Directors' : 'Tutors'}
              activity={activity}
              onAddPresenter={addPresenter}
              onRemovePresenter={removePresenter}
            />
          )}
        </form.Field>
      )}
      <Flex direction="column" gap="3" className={classes.picture}>
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
        {activity.picture && (
          <form.Field name="pictureAltText">
            {(field) => (
              <TextArea
                size="2"
                placeholder="Image description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                onBlur={() => {
                  if (field.state.meta.isDirty) form.handleSubmit();
                }}
              />
            )}
          </form.Field>
        )}
      </Flex>
    </div>
  );
};
