import { useEffect, useMemo, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { capitalize, map, sortBy, uniqBy } from 'lodash-es';

import Button from '@/atoms/Button';
import Placename from '@/atoms/Placename';
import { PlaceName, RegistrationSlotFragment, RegistrationWorkshopFragment } from '@/graphql/types';
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
  const { selected, loading, zoomed, moreInfo, add, remove } = useWorkshopSelectionContext();

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

  const Component = loading ? 'div' : motion.div;

  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (zoomed?.workshop?.id === workshop.id) {
      setZIndex(1);
    } else {
      const timeout = setTimeout(() => setZIndex(undefined), 300);
      return () => clearTimeout(timeout);
    }
  }, [zoomed, workshop.id]);

  return (
    <MotionConfig transition={{ duration: 0.3, ease: 'circOut' }}>
      <Card
        as={Component}
        className="workshop"
        {...(loading ? {} : { layoutId: workshop.id })}
        aria-hidden={loading || undefined}
        data-loading={loading || undefined}
        style={{ zIndex }}
      >
        {loading ? (
          <div className="card__image">
            <Skeleton loading={loading} className="workshop__image">
              <img />
            </Skeleton>
          </div>
        ) : (
          <motion.div className="card__image" layoutId={`${workshop.id}-image`}>
            {workshop.picture && (
              <BlurrableImage
                className="workshop__image"
                src={workshop.picture.medium}
                blurhash={workshop.picture.blurhash}
              />
            )}
          </motion.div>
        )}
        <motion.div className="card__details">
          <h4 className="card__title workshop__name">
            <Skeleton text loading={loading}>
              {workshop.name}
            </Skeleton>
          </h4>
          {loading ? (
            <>
              <div className="workshop__tutors">
                <Skeleton paragraph lines={1}></Skeleton>
              </div>
              <div className="workshop__placenames">
                <Skeleton rounded>
                  <Placename name="Wellington" />
                </Skeleton>
              </div>
            </>
          ) : (
            <>
              <div className="workshop__tutors">
                {sentence(sortBy(map(workshop.tutors, 'name')))}
              </div>
              <div className="workshop__placenames">
                {places.map((place) => (
                  <Placename
                    key={place.id}
                    name={place.name}
                    traditionalName={place.traditionalName ?? undefined}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
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
    </MotionConfig>
  );
};

export default WorkshopCard;
