import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { capitalize, map, sortBy, uniqBy } from 'lodash-es';

import Button from '@/atoms/Button';
import Placename from '@/atoms/Placename';
import {
  PlaceName,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
  useAddPreferenceMutation,
  useRemovePreferenceMutation,
} from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import Card from '@/organisms/Card';
import ordinalize from '@/util/ordinalize';
import sentence from '@/util/sentence';

import BlurrableImage from './BlurrableImage';
import PreferenceCheckbox from './PreferenceCheckbox';
import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type WorkshopCardProps = {
  workshop: RegistrationWorkshopFragment;
  slot: RegistrationSlotFragment;
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, slot }) => {
  const { selected, loading, moreInfo, add, remove } = useWorkshopSelectionContext();

  const sessionId = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => workshop.sessions.find((s) => s.startsAt.equals(slot.startsAt))!.id,
    [slot.startsAt, workshop.sessions]
  );

  const [addPreference] = useAddPreferenceMutation({
    variables: {
      registrationId: null,
      sessionId,
    },
  });

  const [removePreference] = useRemovePreferenceMutation({
    variables: {
      registrationId: null,
      sessionId,
    },
  });

  const preference = useMemo(
    () => (selected.get(slot.startsAt) || []).findIndex((w) => w.id === workshop.id) + 1,
    [workshop, slot, selected]
  );

  const nextAvailable = useMemo(
    () => (selected.get(slot.startsAt) || []).length + 1,
    [selected, slot]
  );

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
    <Card
      as={motion.div}
      className="workshop"
      layoutId={workshop.id}
      aria-hidden={loading || undefined}
      data-loading={loading || undefined}
    >
      <motion.div className="card__image" layoutId={`${workshop.id}-image`}>
        <Skeleton loading={loading}>
          {workshop.picture && (
            <BlurrableImage
              className="workshop__image"
              src={workshop.picture.medium}
              blurhash={workshop.picture.blurhash}
            />
          )}
        </Skeleton>
      </motion.div>
      <div className="card__details">
        <h4 className="card__title workshop__name">
          <Skeleton text loading={loading}>
            {workshop.name}
          </Skeleton>
        </h4>
        <motion.div className="workshop__tutors" layoutId={`${workshop.id}-tutors`}>
          <Skeleton text loading={loading}>
            {sentence(sortBy(map(workshop.tutors, 'name')))}
          </Skeleton>
        </motion.div>
        <motion.div className="workshop__placenames" layoutId={`${workshop.id}-placenames`}>
          {places.map((place) => (
            <Skeleton rounded loading={loading} key={place.id}>
              <Placename name={place.name} traditionalName={place.traditionalName ?? undefined} />
            </Skeleton>
          ))}
        </motion.div>
      </div>
      <PreferenceCheckbox workshop={workshop} slot={slot} preference={preference || null} />
      <div className="card__footer">
        <Skeleton rounded loading={loading}>
          <Button small text="More info" onClick={() => moreInfo({ workshop, slot })} />
        </Skeleton>
        <Skeleton rounded loading={loading}>
          {preference ? (
            <Button small text="Remove" onClick={() => remove({ workshop, slot })} />
          ) : (
            <Button
              small
              primary
              text={capitalize(`${ordinalize(nextAvailable)} choice`)}
              onClick={() => add({ workshop, slot })}
            />
          )}
        </Skeleton>
      </div>
    </Card>
  );
};

export default WorkshopCard;
