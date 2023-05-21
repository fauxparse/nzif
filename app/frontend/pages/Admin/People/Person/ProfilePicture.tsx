import { useRef } from 'react';

import Icon from '@/atoms/Icon';
import {
  Maybe,
  PersonDetailsFragment,
  PersonAttributes,
  useUpdatePersonMutation,
} from '@/graphql/types';

type ProfilePictureProps = {
  profile: Maybe<PersonDetailsFragment>;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const [update] = useUpdatePersonMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !profile) return;

    const fr = new FileReader();
    fr.onload = function () {
      if (!imageRef.current) return;
      imageRef.current.src = fr.result as string;
      imageRef.current.style.opacity = '1';

      update({
        variables: {
          id: profile.id,
          attributes: {
            picture: file,
          } as PersonAttributes,
        },
      });
    };
    fr.readAsDataURL(file);
  };

  return (
    <div className="profile-picture">
      <Icon name="uploadImage" />
      <img
        ref={imageRef}
        src={profile?.picture?.large}
        alt="Profile picture"
        style={{ opacity: profile?.picture ? 1 : 0 }}
      />
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
};

export default ProfilePicture;
