import { useMemo } from 'react';
import { Blurhash } from 'react-blurhash';
import { map, sortBy, uniqBy } from 'lodash-es';

import Button from '@/atoms/Button';
import Checkbox from '@/atoms/Checkbox';
import Placename from '@/atoms/Placename';
import { PlaceName, RegistrationWorkshopFragment } from '@/graphql/types';
import Card from '@/organisms/Card';
import sentence from '@/util/sentence';

import BlurrableImage from './BlurrableImage';

type WorkshopCardProps = {
  workshop: RegistrationWorkshopFragment;
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  const tutors = useMemo(() => sortBy(workshop.tutors, 'name'), [workshop.tutors]);

  const places = useMemo(
    () =>
      uniqBy(
        map(tutors, (t) =>
          t.country?.id === 'NZ' || t.country?.id === 'AU' ? t.city : t.country
        ).filter(Boolean) as PlaceName[],
        'name'
      ),
    [tutors]
  );

  return (
    <Card className="workshop">
      <div className="card__image">
        {workshop.picture && (
          <BlurrableImage
            className="workshop__image"
            src={workshop.picture.medium}
            blurhash={workshop.picture.blurhash}
          />
        )}
      </div>
      <div className="card__details">
        <h4 className="card__title workshop__name">{workshop.name}</h4>
        <div className="workshop__tutors">{sentence(sortBy(map(workshop.tutors, 'name')))}</div>
        <div className="workshop__placenames">
          {places.map((place) => (
            <Placename
              key={place.id}
              name={place.name}
              traditionalName={place.traditionalName ?? undefined}
            />
          ))}
        </div>
      </div>
      <Checkbox className="workshop__checkbox" />
      <div className="card__footer">
        <Button small text="More info" />
        <Button small primary text="First choice" />
      </div>
    </Card>
  );
};

export default WorkshopCard;
