import { MotionConfig, motion } from 'framer-motion';
import { capitalize, map, sortBy, uniqBy } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import {
  Placename as PlacenameType,
  RegistrationPhase,
  RegistrationSlotFragment,
} from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import Tooltip from '@/helpers/Tooltip';
import BlurrableImage from '@/molecules/BlurrableImage';
import Card from '@/organisms/Card';
import ordinalize from '@/util/ordinalize';
import sentence from '@/util/sentence';

import PreferenceCheckbox from './PreferenceCheckbox';
import { useWorkshopSelectionContext } from './WorkshopSelectionContext';
import { WorkshopSession } from './types';

type WorkshopCardProps = {
  session: WorkshopSession;
  slot: RegistrationSlotFragment;
  disabled?: boolean;
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({ session, slot, disabled = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  const workshop = session.workshop;

  const { selected, waitlist, loading, zoomed, registrationPhase, moreInfo, add, remove } =
    useWorkshopSelectionContext();

  const preference = useMemo(
    () => (selected.get(slot.startsAt.valueOf()) || []).findIndex((w) => w.id === workshop.id) + 1,
    [workshop, slot, selected]
  );

  const waitlisted = !!session && waitlist.has(session.id);

  const tutors = useMemo(() => sortBy(workshop.tutors, 'name'), [workshop.tutors]);

  const places = useMemo(
    () =>
      uniqBy(
        map(tutors, (t) =>
          t.country?.id === 'NZ' || t.country?.id === 'AU' ? t.city : t.country
        ).filter(Boolean) as PlacenameType[],
        'name'
      ),
    [tutors]
  );

  const Component = loading ? 'div' : motion.div;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (zoomed?.workshop?.id === workshop.id) {
      el.style.setProperty('z-index', '1');
    } else {
      const timeout = setTimeout(() => el.style.removeProperty('z-index'), 1000);
      return () => clearTimeout(timeout);
    }
  }, [zoomed, workshop.id]);

  const soldOut = session.count >= (session.capacity || Infinity);

  const addButtonText = useMemo(() => {
    if (registrationPhase === RegistrationPhase.Earlybird) {
      const nextAvailable = (selected.get(slot.startsAt.valueOf()) || []).length + 1;
      return capitalize(`${ordinalize(nextAvailable)} choice`);
    }

    if (soldOut) return 'Join waitlist';

    return 'Add';
  }, [registrationPhase, selected, slot.startsAt, soldOut]);

  return (
    <MotionConfig transition={{ duration: 0.3, ease: 'circOut' }}>
      <Card
        ref={ref}
        as={Component}
        className="workshop"
        {...(loading ? {} : { layoutId: session.id })}
        aria-hidden={loading || undefined}
        data-loading={loading || undefined}
      >
        {loading ? (
          <div className="card__image">
            <Skeleton loading={loading} className="workshop__image">
              <img alt="loading" />
            </Skeleton>
          </div>
        ) : (
          <motion.div className="card__image" layoutId={`${session.id}-image`}>
            {workshop.picture && (
              <BlurrableImage
                className="workshop__image"
                src={workshop.picture.medium}
                blurhash={workshop.picture.blurhash}
              />
            )}
          </motion.div>
        )}
        {session.count >= (session.capacity || Infinity) && (
          <div className="workshop__sold-out">Sold out!</div>
        )}
        <div className="card__details">
          <h4 className="card__title workshop__name">
            <Skeleton text loading={loading}>
              {workshop.name}
            </Skeleton>
          </h4>
          {loading ? (
            <>
              <div className="workshop__tutors">
                <Skeleton paragraph lines={1} />
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
          {waitlist.has(session.id) && (
            <div className="workshop__waitlisted">You’re on the waitlist</div>
          )}
        </div>
        <PreferenceCheckbox
          session={session}
          preference={preference}
          disabled={disabled || undefined}
        />
        {workshop.show && (
          <Tooltip content="This workshop has an accompanying show">
            <div className="workshop__to-show">
              <Icon name="show" aria-label="This workshop has an accompanying show" />
            </div>
          </Tooltip>
        )}
        <div className="card__footer">
          <Skeleton rounded loading={loading}>
            <Button small text="More info" onClick={() => moreInfo(session)} />
          </Skeleton>
          <Skeleton rounded loading={loading}>
            {preference ? (
              <Button small text="Remove" onClick={() => remove(session)} />
            ) : waitlisted ? (
              <Button small text="Leave waitlist" onClick={() => remove(session)} />
            ) : (
              <Button
                small
                primary={!soldOut || undefined}
                text={addButtonText}
                disabled={disabled || undefined}
                onClick={() => add(session)}
              />
            )}
          </Skeleton>
        </div>
      </Card>
    </MotionConfig>
  );
};

export default WorkshopCard;
