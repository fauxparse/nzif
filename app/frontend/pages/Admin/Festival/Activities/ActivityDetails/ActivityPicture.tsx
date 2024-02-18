import { useRef } from 'react';

import Icon from '@/atoms/Icon';
import {
  ActivityAttributes,
  ActivityDetailsQuery,
  useUpdateActivityMutation,
} from '@/graphql/types';

type ActivityPictureProps = {
  activity: ActivityDetailsQuery['festival']['activity'];
};

const ActivityPicture: React.FC<ActivityPictureProps> = ({ activity }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const [update] = useUpdateActivityMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !activity) return;

    const fr = new FileReader();
    fr.onload = () => {
      if (!imageRef.current) return;
      imageRef.current.src = fr.result as string;
      imageRef.current.style.opacity = '1';

      update({
        variables: {
          id: activity.id,
          attributes: {
            picture: file,
          } as ActivityAttributes,
        },
      });
    };
    fr.readAsDataURL(file);
  };

  return (
    <div className="activity-picture">
      <Icon name="uploadImage" />
      <img
        ref={imageRef}
        src={activity?.picture?.large}
        alt="Activity picture"
        style={{ opacity: activity?.picture ? 1 : 0 }}
      />
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
};

export default ActivityPicture;
