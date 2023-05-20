import React, { useRef } from 'react';

import Input from '@/atoms/Input';
import { PersonDetailsFragment } from '@/graphql/types';

type SettingsForm = HTMLFormElement & {
  email: HTMLInputElement;
};

type SettingsProps = {
  person: PersonDetailsFragment;
};

const Profile: React.FC<SettingsProps> = ({ person }) => {
  const formRef = useRef<SettingsForm>(null);

  return (
    <div className="inset">
      <form className="person-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="pronouns">Email</label>
        <Input
          id="email"
          name="email"
          defaultValue={person?.user?.email || ''}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            // update({ pronouns: e.currentTarget.value })
            null
          }
        />
      </form>
    </div>
  );
};

export default Profile;
