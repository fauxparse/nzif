import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import Input from '@/atoms/Input';
import {
  PersonDetailsFragment,
  ProfileAttributes,
  usePersonQuery,
  useUpdateProfileMutation,
} from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import usePreference from '@/hooks/usePreference';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import CountryPicker, { useCountries } from '@/molecules/CountryPicker';
import { CountryPickerOption } from '@/molecules/CountryPicker/CountryPicker.types';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import Tabs from '@/molecules/Tabs';
import { useToaster } from '@/molecules/Toaster';

import ProfilePicture from './ProfilePicture';

import './Person.css';

type PersonForm = HTMLFormElement & {
  pronouns: HTMLInputElement;
  city: HTMLInputElement;
  bio: HTMLTextAreaElement;
};

type PersonDetails = PersonDetailsFragment & { bio: string };

const Person: React.FC = () => {
  const formRef = useRef<PersonForm>(null);

  const { id } = useParams<{ id: string }>() as { id: string };

  const { data, loading } = usePersonQuery({ variables: { id } });

  const person = data?.person || null;

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

  const handleRename = (name: string) => {
    update({ name });
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
    formRef.current.pronouns.value = person.pronouns || '';
    formRef.current.bio.value = person.bio || '';
  }, [person, showTraditionalNameByDefault]);

  return (
    <BreadcrumbProvider label="People" path="people">
      <div className="page">
        <header className="page__header">
          <Breadcrumbs />
          <h1>
            {loading || !person ? (
              'Loading…'
            ) : (
              <InPlaceEdit value={person.name} onChange={handleRename} />
            )}
          </h1>
          <Tabs>
            <Tabs.Tab as={Link} to="" text="Profile" selected />
          </Tabs>
        </header>
        <div className="inset">
          <form className="person-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <ProfilePicture profile={person} />
            <label htmlFor="pronouns">Pronouns</label>
            <Input
              id="pronouns"
              name="pronouns"
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                update({ pronouns: e.currentTarget.value })
              }
            />
            <label htmlFor="city">City</label>
            <Input
              id="city"
              name="city"
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleCity(e.currentTarget.value)}
            />
            <label htmlFor="country">Country</label>
            <CountryPicker id="country" value={person?.country?.id} onChange={handleCountry} />
            <label htmlFor="bio">Bio</label>
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
          </form>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};

export default Person;
