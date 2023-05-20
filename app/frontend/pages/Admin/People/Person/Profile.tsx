import React, { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash-es';

import Input from '@/atoms/Input';
import { ProfileAttributes, useUpdateProfileMutation } from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import usePreference from '@/hooks/usePreference';
import CountryPicker, { useCountries } from '@/molecules/CountryPicker';
import { CountryPickerOption } from '@/molecules/CountryPicker/CountryPicker.types';
import { useToaster } from '@/molecules/Toaster';

import { PersonDetails } from './Person.types';
import ProfilePicture from './ProfilePicture';

type PersonForm = HTMLFormElement & {
  email: HTMLInputElement;
  pronouns: HTMLInputElement;
  city: HTMLInputElement;
  bio: HTMLTextAreaElement;
};

type ProfileProps = {
  person: PersonDetails;
};

const Profile: React.FC<ProfileProps> = ({ person }) => {
  const formRef = useRef<PersonForm>(null);

  const [updateProfile] = useUpdateProfileMutation();

  const updates = useRef({
    saving: false,
    timer: null as number | null,
    attributes: {} as Partial<ProfileAttributes>,
    optimistic: {} as Partial<PersonDetails>,
  });

  const { notify } = useToaster();

  const update = (
    attributes: Partial<ProfileAttributes>,
    optimistic: Partial<PersonDetails> = {}
  ) => {
    if (!person) return;

    Object.assign(updates.current.attributes, attributes);
    Object.assign(updates.current.optimistic, optimistic);
    if (updates.current.timer) clearTimeout(updates.current.timer);

    const doUpdate = async () => {
      updates.current.saving = true;

      const { attributes, optimistic } = updates.current;

      updates.current.attributes = {};
      updates.current.optimistic = {};

      await updateProfile({
        variables: {
          id: person.id,
          attributes: attributes as ProfileAttributes,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProfile: {
            __typename: 'UpdateProfilePayload',
            profile: {
              ...person,
              ...attributes,
              ...optimistic,
            } as PersonDetails,
          },
        },
      });
      updates.current.saving = false;
      notify('Changes saved');

      if (!isEmpty(updates.current.attributes)) {
        doUpdate();
      }
    };

    if (!updates.current.saving) {
      updates.current.timer = window.setTimeout(doUpdate, 2000);
    }
  };

  const { countries } = useCountries();

  const handleCity = (city: string) =>
    update(
      { city },
      { city: { __typename: 'PlaceName', id: city, name: city, traditionalName: null } }
    );

  const handleCountry = (countryId: string) => {
    const option = countries.find((option: CountryPickerOption) => option.value === countryId);
    const optimisticCountry: PersonDetails['country'] = option
      ? {
          __typename: 'PlaceName',
          id: countryId,
          name: option.label,
          traditionalName: null,
        }
      : null;
    if (optimisticCountry && option?.label.includes('(')) {
      const match = option.label.match(/^(.+?) \((.+?)\)$/);
      if (match) {
        const [, name, traditionalName] = match;
        optimisticCountry.name = name;
        optimisticCountry.traditionalName = traditionalName;
      }
    }
    update({ country: countryId }, { country: optimisticCountry });
  };

  const [showTraditionalNameByDefault] = usePreference<boolean>('showTraditionalNames', true);

  useEffect(() => {
    if (!formRef.current || !person) return;
    formRef.current.city.value =
      person.city?.[showTraditionalNameByDefault ? 'traditionalName' : 'name'] || '';
    if (person.user && formRef.current.email) {
      formRef.current.email.value = person.user.email;
    }
    formRef.current.pronouns.value = person.pronouns || '';
    formRef.current.bio.value = person.bio || '';
  }, [person, showTraditionalNameByDefault]);

  return (
    <div className="inset">
      <form className="person-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
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
          <div className="labelled">
            <label htmlFor="email">Email</label>
            {person?.user ? (
              <Input id="email" type="email" name="email" readOnly />
            ) : (
              <p className="labelled__hint">This person has never logged in.</p>
            )}
          </div>
          <div className="labelled">
            <label htmlFor="pronouns">Pronouns</label>
            <Input
              id="pronouns"
              name="pronouns"
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                update({ pronouns: e.currentTarget.value })
              }
            />
            <p className="labelled__hint">
              e.g. <em>she/her</em>, <em>he/him</em>, <em>they/them</em>
            </p>
          </div>
          <div className="labelled">
            <label htmlFor="bio">Short bio/blurb</label>
            <AutoResize>
              <Input
                as="textarea"
                id="bio"
                name="bio"
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) =>
                  update({ bio: e.currentTarget.value })
                }
              />
            </AutoResize>
            <p className="labelled__hint">
              This information will be shown alongside shows and workshops you’re leading.
            </p>
          </div>
        </section>
        <section>
          <header>
            <h3>Location</h3>
            <p>Where you’re from</p>
          </header>
          <div className="labelled">
            <label htmlFor="city">City</label>
            <Input
              id="city"
              name="city"
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleCity(e.currentTarget.value)}
            />
          </div>
          <div className="labelled">
            <label htmlFor="country">Country</label>
            <CountryPicker id="country" value={person?.country?.id} onChange={handleCountry} />
          </div>
        </section>
      </form>
    </div>
  );
};

export default Profile;
