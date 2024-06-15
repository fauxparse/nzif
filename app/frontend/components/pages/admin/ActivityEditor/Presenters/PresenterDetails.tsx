import { CityPicker } from '@/components/molecules/CityPicker';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import { Editor } from '@/components/organisms/Editor';
import { CityAttributes, PersonAttributes } from '@/graphql/types';
import TrashIcon from '@/icons/TrashIcon';
import { useMutation } from '@apollo/client';
import { Box, Button, TextInput } from '@mantine/core';
import { createFormFactory } from '@tanstack/react-form';
import { isEmpty } from 'lodash-es';
import { useRef } from 'react';
import { PresenterDetailsFragment, UpdatePresenterMutation } from '../queries';
import { Presenter, WithUploadedPicture } from '../types';

export type Fields = WithUploadedPicture<
  Omit<Presenter, 'picture' | 'city' | 'country'> & { city: string | null; country: string | null }
>;

type PresenterDetailsProps = {
  presenter: Presenter;
  onRemove: (presenter: Presenter) => void;
};

const formFactory = createFormFactory<Fields>({
  defaultValues: {
    id: '',
    name: '',
    pronouns: '',
    bio: '',
    city: null,
    country: null,
    uploadedPicture: null,
  },
});

export const PresenterDetails: React.FC<PresenterDetailsProps> = ({ presenter, onRemove }) => {
  const [updateMutation] = useMutation(UpdatePresenterMutation);

  const lastSaved = useRef(presenter);

  const update = (attributes: Partial<PersonAttributes>) =>
    updateMutation({
      variables: {
        id: presenter.id,
        attributes,
      },
      update: (cache, { data }) => {
        if (data?.updatePerson?.profile) {
          cache.writeFragment({
            id: cache.identify(data.updatePerson.profile),
            fragment: PresenterDetailsFragment,
            data: data.updatePerson.profile,
          });
        }
      },
    }).then(({ data }) => {
      if (data?.updatePerson?.profile) lastSaved.current = data.updatePerson.profile;
    });

  const form = formFactory.useForm({
    asyncDebounceMs: 1000,
    defaultValues: {
      id: presenter.id,
      name: presenter.name,
      pronouns: presenter.pronouns,
      bio: presenter.bio,
      city: presenter.city?.name ?? null,
      country: presenter.city?.country ?? null,
      uploadedPicture: null,
    },
    validators: {
      onChangeAsync: () => {
        form.handleSubmit();
        return undefined;
      },
      onChange: ({ value }) => {
        if (value.bio !== lastSaved.current.bio || value.city !== lastSaved.current.city?.name) {
          form.handleSubmit();
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const attributes: Partial<PersonAttributes> = {};

      const presenter = lastSaved.current;

      if (value.name !== presenter.name) {
        attributes.name = value.name;
      }
      if (value.pronouns !== presenter.pronouns) {
        attributes.pronouns = value.pronouns;
      }
      if (value.bio !== presenter.bio) {
        attributes.bio = value.bio;
      }
      if ((value.city ?? null) !== (presenter.city?.name ?? null)) {
        attributes.city =
          value.city && value.country
            ? ({
                name: value.city,
                country: value.country,
              } as CityAttributes)
            : null;
      }

      if (value.uploadedPicture) {
        attributes.uploadedPicture = value.uploadedPicture;
      }

      if (!isEmpty(attributes)) {
        await update(attributes);
      }
    },
  });

  const name = form.useStore((state) => state.values.name);

  const { confirm } = useConfirmation();

  const removeClicked = () => {
    confirm({
      title: 'Remove presenter',
      children: `Are you sure you want to remove ${name}?`,
      countdown: 0,
    }).then(() => onRemove(presenter));
  };

  return (
    <Box className="presenter-details">
      <form.Field name="name">
        {(field) => (
          <TextInput
            size="md"
            className="presenter-details__name"
            placeholder="Name"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.currentTarget.value)}
          />
        )}
      </form.Field>
      <form.Field name="pronouns">
        {(field) => (
          <TextInput
            size="md"
            className="presenter-details__pronouns"
            placeholder="Pronouns"
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.currentTarget.value)}
          />
        )}
      </form.Field>
      <form.Field name="bio">
        {(field) => (
          <Editor
            className="presenter-details__bio"
            placeholder="Presenter bio"
            value={field.state.value || ''}
            onChange={(value) => {
              if (value === field.state.value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <form.Field name="uploadedPicture">
        {(field) => (
          <ImageUploader
            className="presenter-details__picture"
            compact
            width={512}
            height={512}
            value={presenter.picture?.medium ?? null}
            onChange={field.handleChange}
          />
        )}
      </form.Field>
      <form.Field name="city">
        {(field) => (
          <CityPicker
            className="presenter-details__city"
            city={field.state.value}
            country={field.form.getFieldValue('country')}
            onChange={(city, country) => {
              field.handleChange(city);
              form.setFieldValue('country', country);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <Box className="presenter-details__buttons">
        <Button leftSection={<TrashIcon />} onClick={removeClicked}>
          Remove {name}
        </Button>
      </Box>
    </Box>
  );
};
