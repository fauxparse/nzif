import { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  onMoreInfoClick: (workshop: RegistrationWorkshopFragment) => void;
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onMoreInfoClick }) => {
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
    <Card as={motion.div} className="workshop" layoutId={workshop.id}>
      <motion.div className="card__image" layoutId={`${workshop.id}-image`}>
        {workshop.picture && (
          <BlurrableImage
            className="workshop__image"
            src={workshop.picture.medium}
            blurhash={workshop.picture.blurhash}
          />
        )}
      </motion.div>
      <div className="card__details">
        <h4 className="card__title workshop__name">{workshop.name}</h4>
        <motion.div className="workshop__tutors" layoutId={`${workshop.id}-tutors`}>
          {sentence(sortBy(map(workshop.tutors, 'name')))}
        </motion.div>
        <motion.div className="workshop__placenames" layoutId={`${workshop.id}-placenames`}>
          {places.map((place) => (
            <Placename
              key={place.id}
              name={place.name}
              traditionalName={place.traditionalName ?? undefined}
            />
          ))}
        </motion.div>
      </div>
      <Checkbox className="workshop__checkbox" />
      <div className="card__footer">
        <Button small text="More info" onClick={() => onMoreInfoClick(workshop)} />
        <Button small primary text="First choice" />
      </div>
    </Card>
  );
};

export default WorkshopCard;
