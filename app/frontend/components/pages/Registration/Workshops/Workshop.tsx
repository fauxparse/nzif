import { ActivityCard } from '@/components/molecules/ActivityCard';
import { RegistrationPhase } from '@/graphql/types';
import PlusIcon from '@/icons/PlusIcon';
import { useRegistration } from '@/services/Registration';
import { Button, IconButton, Inset } from '@radix-ui/themes';
import { usePreferences } from './WorkshopPreferencesProvider';
import { Session } from './types';

import CheckboxIcon from '@/icons/CheckboxIcon';
import CloseIcon from '@/icons/CloseIcon';
import WaitlistIcon from '@/icons/WaitlistIcon';
import classes from './Workshops.module.css';

type WorkshopProps = {
  session: Session;
};

export const Workshop: React.FC<WorkshopProps> = ({ session }) => {
  const { phase, earlybird, registration } = useRegistration();

  const { add, remove, getPosition, disabledSessions, sessions, waitlist } = usePreferences();

  const readOnly = phase === RegistrationPhase.Paused || phase === RegistrationPhase.Closed;

  const position = getPosition(session);

  const wasRegistered = registration?.sessions?.some((s) => s.id === session.id);

  const registered = sessions.has(session.id);

  const waitlisted = waitlist.has(session.id);

  const soldOut = !earlybird && !!session.capacity && session.count >= session.capacity;

  const toggle = () => {
    if (earlybird ? position : registered || waitlisted) {
      remove(session);
    } else {
      add(session);
    }
  };

  const disabled = readOnly || disabledSessions.includes(session);

  return (
    <ActivityCard
      disabled={disabled}
      className={classes.card}
      activity={session.workshop}
      linkProps={{
        to: '/register/workshops/$slug',
        params: { slug: session.workshop.slug },
        search: { session: session.id },
        replace: true,
      }}
      buttons={
        !earlybird && (
          <Button
            type="button"
            variant="outline"
            size={{ initial: '1', sm: '2' }}
            onClick={toggle}
            disabled={disabled || undefined}
          >
            {registered ? (
              <>
                <CloseIcon /> Leave workshop
              </>
            ) : waitlisted ? (
              <>
                <WaitlistIcon /> Leave waitlist
              </>
            ) : soldOut && !wasRegistered ? (
              <>
                <WaitlistIcon /> Join waitlist
              </>
            ) : (
              <>
                <PlusIcon /> Add workshop
              </>
            )}
          </Button>
        )
      }
    >
      {earlybird ? (
        <>
          {(!readOnly || !!position) && (
            <IconButton
              type="button"
              variant={position ? 'solid' : 'surface'}
              radius="full"
              className={classes.preference}
              onClick={toggle}
              disabled={disabled || undefined}
              data-filled={!!position}
            >
              {position ?? <PlusIcon />}
            </IconButton>
          )}
        </>
      ) : (
        <IconButton
          type="button"
          variant={registered || waitlisted ? 'solid' : 'surface'}
          radius="full"
          className={classes.preference}
          onClick={toggle}
          disabled={disabled || undefined}
          data-filled={registered || waitlisted || undefined}
        >
          {registered ? <CheckboxIcon /> : waitlisted ? <WaitlistIcon /> : null}
        </IconButton>
      )}
      {soldOut && (
        <Inset side={{ initial: 'all', sm: 'x' }} asChild>
          <span className={classes.soldOut}>Sold out</span>
        </Inset>
      )}
    </ActivityCard>
  );
};
