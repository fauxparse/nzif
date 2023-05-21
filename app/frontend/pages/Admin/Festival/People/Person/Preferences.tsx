import React, { useMemo } from 'react';

import { ABOUT_TRADITIONAL_PLACENAMES } from '@/atoms/Placename';
import Switch from '@/atoms/Switch';
import { PreferenceValueFragmentFragment, usePreferencesQuery } from '@/graphql/types';
import Labelled from '@/helpers/Labelled';

import { PersonDetails } from './Person.types';

type User = NonNullable<PersonDetails['user']>;

export type PreferencesProps = {
  user: User;
};

const isBooleanPreference = <T extends PreferenceValueFragmentFragment>(
  preference: T
): preference is Extract<T, { __typename: 'BooleanPreference' }> =>
  preference.__typename === 'BooleanPreference';

const Preferences: React.FC<PreferencesProps> = ({ user }) => {
  const { data } = usePreferencesQuery({ variables: { id: user.id } });

  const preferences = useMemo<Map<string, boolean>>(
    () =>
      (data?.user?.preferences || []).filter(isBooleanPreference).reduce((map, { id }) => {
        return map.set(id, true);
      }, new Map<string, boolean>()),
    [data]
  );

  return (
    <div className="inset">
      <form className="details-form">
        {!!data?.user?.preferences?.length && (
          <section className="preferences">
            <header>
              <h3>Appearance</h3>
            </header>

            <Labelled
              id="showTraditionalNames"
              name="showTraditionalNames"
              label="Show traditional names by default"
              hint={ABOUT_TRADITIONAL_PLACENAMES}
            >
              <Switch
                id="showTraditionalNames"
                defaultChecked={preferences.get('showTraditionalNames') || false}
              />
            </Labelled>
          </section>
        )}
      </form>
    </div>
  );
};

export default Preferences;
