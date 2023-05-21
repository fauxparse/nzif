import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pick } from 'lodash-es';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import { PersonAttributes, useUpdatePersonMutation } from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import Labelled from '@/helpers/Labelled';
import CountryPicker from '@/molecules/CountryPicker';
import { useToaster } from '@/molecules/Toaster';

import Permissions from './Permissions';
import { PersonDetails } from './Person.types';
import ProfilePicture from './ProfilePicture';

type ProfileProps = {
  person: PersonDetails;
};

const formSchema = z.object({
  name: z.string(),
  pronouns: z.string(),
  bio: z.string(),
  city: z.string(),
  country: z.string(),
  picture: z.instanceof(File).nullish(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Profile: React.FC<ProfileProps> = ({ person }) => {
  const [updatePerson, { loading: saving }] = useUpdatePersonMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    setValue,
  } = useForm<FormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: person?.name || '',
      pronouns: person?.pronouns || '',
      bio: person?.bio || '',
      city: person?.city?.name || '',
      country: person?.country?.id || 'NZ',
    },
  });

  const { notify } = useToaster();

  const onSubmit = async (allAttributes: FormSchemaType) => {
    const attributes = pick(allAttributes, Object.keys(dirtyFields)) as PersonAttributes;
    await updatePerson({
      variables: {
        id: person.id,
        attributes,
      },
    });
    notify('Changes saved');
  };

  return (
    <div className="inset">
      <form
        className="details-form"
        aria-busy={saving || undefined}
        onSubmit={handleSubmit(onSubmit)}
      >
        <section>
          <header>
            <h3>Profile picture</h3>
            <p>How other people will see you on the website</p>
          </header>
          <ProfilePicture profile={person} />
        </section>
        <section>
          <header>
            <h3>General information</h3>
            <p>More about you</p>
          </header>
          <Labelled
            name="email"
            label="Email"
            errors={errors}
            hint={!person?.user ? 'This person has never logged in.' : undefined}
          >
            {person?.user && <Input id="email" type="email" name="email" readOnly />}
          </Labelled>
          <Labelled
            name="pronouns"
            label="Pronouns"
            hint={
              <>
                e.g. <em>she/her</em>, <em>he/him</em>, <em>they/them</em>
              </>
            }
            errors={errors}
          >
            <Input id="pronouns" {...register('pronouns')} />
          </Labelled>
          <Labelled
            name="bio"
            label="Short bio/blurb"
            hint="This information will be shown alongside shows and workshops you’re leading."
            errors={errors}
          >
            <AutoResize>
              <Input as="textarea" id="bio" {...register('bio')} />
            </AutoResize>
          </Labelled>
        </section>
        <section>
          <header>
            <h3>Location</h3>
            <p>Where you’re from</p>
          </header>
          <Labelled label="City" name="city" errors={errors}>
            <Input id="city" {...register('city')} />
          </Labelled>
          <Labelled label="Country" name="country" errors={errors}>
            <CountryPicker
              id="country"
              value={person?.country?.id}
              onChange={(value) => setValue('country', value)}
            />
          </Labelled>
        </section>
        {person?.user && <Permissions />}

        <section className="details-form__buttons">
          <Button primary type="submit" text="Save changes" disabled={!isDirty} />
        </section>
      </form>
    </div>
  );
};

export default Profile;
