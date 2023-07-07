import { useMemo } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { motion, MotionConfig, useIsPresent } from 'framer-motion';
import { map, sortBy, uniqBy } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import {
  PlaceName,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
  useWorkshopDetailsQuery,
  WorkshopDetailsFragment,
  WorkshopDetailsQuery,
} from '@/graphql/types';
import Markdown from '@/helpers/Markdown';
import Scrollable from '@/helpers/Scrollable';
import Skeleton from '@/helpers/Skeleton';
import Dialog, { overlayVariants } from '@/organisms/Dialog';
import ordinalize from '@/util/ordinalize';
import sentence from '@/util/sentence';

import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type WorkshopDetailsProps = {
  workshop: RegistrationWorkshopFragment;
  slot: RegistrationSlotFragment;
};

const isWorkshop = (
  workshop: WorkshopDetailsQuery['festival']['activity'] | null | undefined
): workshop is WorkshopDetailsFragment => workshop?.type === 'Workshop';

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, slot }) => {
  const open = useIsPresent();

  const { moreInfo, selected, add, remove } = useWorkshopSelectionContext();

  const preference = useMemo(
    () => (selected.get(slot.startsAt) || []).findIndex((w) => w.id === workshop.id) + 1,
    [workshop, slot, selected]
  );

  const nextAvailable = useMemo(
    () => (selected.get(slot.startsAt) || []).length + 1,
    [selected, slot]
  );

  const { loading, data } = useWorkshopDetailsQuery({
    variables: { slug: workshop.slug },
  });

  const workshopDetails = data?.festival?.activity;

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

  const dateAndTime = useMemo(
    () => `${slot.startsAt.plus(0).toFormat('EEEE d MMMM, ha')}–${slot.endsAt.toFormat('ha')}`,
    [slot]
  );

  const slotDetails = useMemo(
    () =>
      isWorkshop(workshopDetails) &&
      workshopDetails?.sessions?.find((s) => s.startsAt.toMillis() === slot.startsAt.toMillis()),
    [workshopDetails, slot.startsAt]
  );

  const { venue } = slotDetails || {};

  const tutorDetails: WorkshopDetailsFragment['tutors'] =
    (isWorkshop(workshopDetails) && workshopDetails.tutors) ||
    workshop.tutors.map((t) => ({ ...t, bio: '' }));

  const close = () => moreInfo(null);

  const addToRegistration = () => {
    add({ workshop, slot });
    close();
  };

  const removeFromRegistration = () => {
    remove({ workshop, slot });
    close();
  };

  return (
    <MotionConfig transition={{ duration: 0.3, ease: 'circOut' }}>
      <RemoveScroll forwardProps enabled={open}>
        <motion.div className="workshop-details">
          <motion.div
            className="workshop-details__overlay"
            variants={overlayVariants}
            animate={open ? 'open' : 'closed'}
          />
          <motion.div className="dialog__content workshop-details__dialog" layoutId={workshop.id}>
            <header className="workshop-details__header">
              {workshop.picture && (
                <motion.div className="workshop-details__image" layoutId={`${workshop.id}-image`}>
                  <img src={workshop.picture.medium} alt={workshop.name} aria-hidden />
                </motion.div>
              )}
              <h3 className="workshop-details__title">{workshop.name}</h3>
              <Button className="workshop-details__close" ghost icon="close" onClick={close} />
            </header>
            <Scrollable>
              <Dialog.Body className="workshop-details__body">
                <div className="workshop-details__tutors">
                  {sentence(sortBy(map(workshop.tutors, 'name')))}
                </div>
                <div className="workshop-details__placenames">
                  {places.map((place) => (
                    <Placename
                      key={place.id}
                      name={place.name}
                      traditionalName={place.traditionalName ?? undefined}
                    />
                  ))}
                </div>
                <aside className="workshop-details__at-a-glance">
                  <dl>
                    <dt>
                      <Icon name="calendar" aria-label="Date and time" />
                    </dt>
                    <dd>{dateAndTime}</dd>
                    <dt>
                      <Icon name="location" aria-label="Location" />
                    </dt>
                    <dd>
                      <Skeleton text loading={loading}>
                        {venue ? [venue.room, venue.building].filter(Boolean).join(' at ') : 'TBC'}
                      </Skeleton>
                    </dd>
                  </dl>
                </aside>
                <motion.div className="workshop-details__description">
                  <Skeleton paragraph loading={loading} lines={5}>
                    {isWorkshop(workshopDetails) && (
                      <Markdown>{workshopDetails.description}</Markdown>
                    )}
                  </Skeleton>
                  {workshop.show && (
                    <div className="workshop-details__associated-show">
                      <p>
                        Participants from this workshop may be invited to perform in the show on
                        Saturday 14 October. Please note that any such casting is at the discretion
                        of the show’s director and is not guaranteed.
                      </p>
                    </div>
                  )}
                  {tutorDetails.map((tutor) => (
                    <div key={tutor.id} className="workshop-details__bio">
                      <h4>
                        <Skeleton text loading={loading}>
                          {tutor.name}
                        </Skeleton>
                      </h4>
                      <Skeleton paragraph lines={3} loading={loading}>
                        <Markdown>{tutor.bio}</Markdown>
                      </Skeleton>
                    </div>
                  ))}
                </motion.div>
              </Dialog.Body>
            </Scrollable>
            <Dialog.Footer className="workshop-details__footer">
              {preference ? (
                <Button text="Remove" onClick={removeFromRegistration} />
              ) : (
                <Button
                  primary
                  text={`Add as ${ordinalize(nextAvailable)} choice`}
                  onClick={addToRegistration}
                />
              )}
            </Dialog.Footer>
          </motion.div>
        </motion.div>
      </RemoveScroll>
    </MotionConfig>
  );
};

export default WorkshopDetails;
