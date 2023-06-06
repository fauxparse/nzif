import { useMemo } from 'react';
import { motion, useIsPresent } from 'framer-motion';
import { map, sortBy, uniqBy } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import {
  PlaceName,
  RegistrationWorkshopFragment,
  RegistrationWorkshopSlotFragment,
  useWorkshopDetailsQuery,
  WorkshopDetailsFragment,
  WorkshopDetailsQuery,
} from '@/graphql/types';
import Markdown from '@/helpers/Markdown';
import Scrollable from '@/helpers/Scrollable';
import Skeleton from '@/helpers/Skeleton';
import Dialog, { overlayVariants } from '@/organisms/Dialog';
import sentence from '@/util/sentence';

type WorkshopDetailsProps = {
  workshop: RegistrationWorkshopFragment;
  slot: RegistrationWorkshopSlotFragment;
  onOpenChange: (open: boolean) => void;
};

const isWorkshop = (
  workshop: WorkshopDetailsQuery['festival']['activity'] | null | undefined
): workshop is WorkshopDetailsFragment => workshop?.type === 'Workshop';

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ workshop, slot, onOpenChange }) => {
  const open = useIsPresent();

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
      workshopDetails?.slots?.find((s) => s.startsAt.toMillis() === slot.startsAt.toMillis()),
    [workshopDetails, slot.startsAt]
  );

  const { venue } = slotDetails || {};

  const tutorDetails: WorkshopDetailsFragment['tutors'] =
    (isWorkshop(workshopDetails) && workshopDetails.tutors) ||
    workshop.tutors.map((t) => ({ ...t, bio: '' }));

  return (
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
          <h3 className="workshop-details__title" onClick={() => onOpenChange(false)}>
            {workshop.name}
          </h3>
          <Button
            className="workshop-details__close"
            ghost
            icon="close"
            onClick={() => onOpenChange(false)}
          />
        </header>
        <Scrollable>
          <Dialog.Body className="workshop-details__body">
            <motion.div className="workshop-details__tutors" layoutId={`${workshop.id}-tutors`}>
              {sentence(sortBy(map(workshop.tutors, 'name')))}
            </motion.div>
            <motion.div
              className="workshop-details__placenames"
              layoutId={`${workshop.id}-placenames`}
            >
              {places.map((place) => (
                <Placename
                  key={place.id}
                  name={place.name}
                  traditionalName={place.traditionalName ?? undefined}
                />
              ))}
            </motion.div>
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
                {isWorkshop(workshopDetails) && <Markdown>{workshopDetails.description}</Markdown>}
              </Skeleton>
              {tutorDetails.map((tutor) => (
                <div key={tutor.id} className="workshop-details__bio">
                  <h4>
                    <Skeleton text loading={loading}>
                      {tutor.name}
                    </Skeleton>
                  </h4>
                  <Skeleton paragraph lines={3} loading={loading}>
                    {tutor.bio}
                  </Skeleton>
                </div>
              ))}
            </motion.div>
          </Dialog.Body>
        </Scrollable>
        <Dialog.Footer className="workshop-details__footer">
          <Button primary text="Add as first choice" />
        </Dialog.Footer>
      </motion.div>
    </motion.div>
  );
};

export default WorkshopDetails;
