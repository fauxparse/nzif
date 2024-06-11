import { CityPicker } from '@/components/molecules/CityPicker';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Editor } from '@/components/organisms/Editor';
import TrashIcon from '@/icons/TrashIcon';
import { Box, Button, TextInput } from '@mantine/core';
import { createFormFactory } from '@tanstack/react-form';
import { Presenter, WithUploadedPicture } from '../types';

type Fields = WithUploadedPicture<
  Omit<Presenter, 'picture' | 'city' | 'country'> & { city: string | null; country: string | null }
>;

type PresenterDetailsProps = {
  presenter: Presenter;
  onChange: (presenter: Fields) => void;
  onRemove: (presenter: Presenter) => void;
};

const formFactory = createFormFactory<Fields>({
  defaultValues: {
    id: '',
    name: '',
    bio: '',
    city: null,
    country: null,
    uploadedPicture: null,
  },
});

export const PresenterDetails: React.FC<PresenterDetailsProps> = ({
  presenter,
  onChange,
  onRemove,
}) => {
  const form = formFactory.useForm({
    defaultValues: {
      id: presenter.id,
      name: presenter.name,
      bio: presenter.bio,
      city: presenter.city?.name ?? null,
      country: presenter.city?.country ?? null,
      uploadedPicture: null,
    },
    onSubmit: async ({ value }) => {
      onChange(value);
    },
  });

  const name = form.useStore((state) => state.values.name);

  return (
    <Box className="presenter-details">
      <form.Field name="name">
        {(field) => (
          <TextInput
            size="lg"
            className="presenter-details__name"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.currentTarget.value)}
          />
        )}
      </form.Field>
      <form.Field name="bio">
        {(field) => (
          <Editor
            className="presenter-details__bio"
            placeholder="Presenter bio"
            value={field.state.value}
            onChange={field.handleChange}
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
            city={field.state.value}
            country={field.form.getFieldValue('country')}
            onChange={(city, country) => {
              field.handleChange(city);
              field.form.setFieldValue('country', country);
            }}
          />
        )}
      </form.Field>
      <Box>
        <Button leftSection={<TrashIcon />}>Remove {name}</Button>
      </Box>
    </Box>
  );
};
