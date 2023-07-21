import React, { useMemo } from 'react';

import { ABOUT_TRADITIONAL_PLACENAMES } from '@/atoms/Placename';
import Switch from '@/atoms/Switch';
import {
  SettingValue,
  SettingValueFragmentFragment,
  useSettingsQuery,
  useUpdateSettingMutation,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';

import { PersonDetails } from './Person.types';

type User = NonNullable<PersonDetails['user']>;

export type SettingsProps = {
  user: User;
};

const isBooleanSetting = <T extends SettingValueFragmentFragment>(
  setting: T
): setting is Extract<T, { __typename: 'BooleanSetting' }> =>
  setting.__typename === 'BooleanSetting';

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const { data } = useSettingsQuery({ variables: { id: user.id } });

  const settings = useMemo<Map<string, boolean>>(
    () =>
      (data?.user?.settings || []).filter(isBooleanSetting).reduce((map, { id }) => {
        return map.set(id, true);
      }, new Map<string, boolean>()),
    [data]
  );

  const [updateSetting] = useUpdateSettingMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.currentTarget;
    updateSetting({ variables: { id, value: { boolean: checked } as SettingValue } });
  };

  return (
    <div className="inset">
      <form className="details-form">
        {!!data?.user?.settings?.length && (
          <section className="settings">
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
                name="showTraditionalNames"
                defaultChecked={settings.get('showTraditionalNames') || false}
                onChange={handleChange}
              />
            </Labelled>
          </section>
        )}
      </form>
    </div>
  );
};

export default Settings;
