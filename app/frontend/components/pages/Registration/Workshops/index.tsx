import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { Button, Callout, Dialog, Flex, Section, Text, VisuallyHidden } from '@radix-ui/themes';
import { useChildMatches } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { get, isEmpty } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Buttons } from '../Buttons';
import registrationClasses from '../Registration.module.css';
import { Day } from './Day';
import { WorkshopDetails } from './WorkshopDetails';
import { usePreferences } from './WorkshopPreferencesProvider';
import { SaveWorkshopPreferencesMutation } from './queries';
import { Session, Workshop } from './types';

import { RegistrationPhase } from '@/graphql/types';
import WarningIcon from '@/icons/WarningIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import pluralize from 'pluralize';
import { Intro } from './Intro';
import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const {
    registration,
    phase,
    earlybird,
    loading: registrationLoading,
    goToNextStep,
  } = useRegistration();

  const { days, loading, dirty, value, disabledSessions, sessions, waitlist, getSession } =
    usePreferences();

  const [save] = useMutation(SaveWorkshopPreferencesMutation);

  const { workshop, session, open, close } = useSelectedWorkshop();

  const changes = useMemo(() => {
    const oldSessions = new Set(registration?.sessions?.map((s) => s.id) ?? []);
    const oldWaitlist = new Set(registration?.waitlist?.map((s) => s.id) ?? []);

    if (loading || earlybird) {
      return {
        sessions: {
          added: [],
          removed: [],
        },
        waitlist: {
          added: [],
          removed: [],
        },
      };
    }

    return {
      sessions: {
        added: [...sessions].filter((s) => !oldSessions.has(s)).map(getSession),
        removed: [...oldSessions].filter((s) => !sessions.has(s)).map(getSession),
      },
      waitlist: {
        added: [...waitlist].filter((s) => !oldWaitlist.has(s)).map(getSession),
        removed: [...oldWaitlist].filter((s) => !waitlist.has(s)).map(getSession),
      },
    };
  }, [loading, earlybird, registration, sessions, waitlist]);

  const [confirming, setConfirming] = useState(false);

  const confirmChanges = async () => {
    const {
      sessions: { added: addedSessions, removed: removedSessions },
    } = changes;

    if (!registration?.completedAt || (isEmpty(addedSessions) && isEmpty(removedSessions))) {
      return saveAndContinue();
    }

    setConfirming(true);
  };

  const saveAndContinue = async () => {
    if (dirty) {
      save({
        variables: {
          preferences: Object.entries(value).map(([sessionId, position]) => ({
            sessionId,
            position,
          })),
        },
      }).then(goToNextStep);
    } else {
      goToNextStep();
    }
  };

  return (
    <form
      className={clsx(registrationClasses.page, classes.workshopSelection)}
      data-full-width
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmChanges();
      }}
    >
      <Section maxWidth="40em" py="6">
        <Intro />
      </Section>

      <div>
        {days.map((day) => (
          <Day key={day.date.toISODate()} date={day.date} workshops={day.workshops} />
        ))}
      </div>

      {workshop && (
        <WorkshopDetails
          open={open}
          workshop={workshop}
          session={session}
          disabled={
            phase === RegistrationPhase.Paused ||
            phase === RegistrationPhase.Closed ||
            disabledSessions.some((s) => s.id === session?.id)
          }
          onClose={close}
        />
      )}

      <Buttons disabled={loading || registrationLoading} />

      <Dialog.Root open={confirming} onOpenChange={setConfirming}>
        <Dialog.Content>
          <Dialog.Title>Just making sure…</Dialog.Title>
          <VisuallyHidden>
            <Dialog.Description>Confirm changes to workshop registration.</Dialog.Description>
          </VisuallyHidden>

          <Flex direction="column" gap="4">
            {!isEmpty(changes.sessions.removed) && (
              <>
                <div>
                  <Text as="p" mb="2">
                    You will be removed from the following{' '}
                    {pluralize('workshop', changes.sessions.removed.length)}:
                  </Text>
                  <SessionList sessions={changes.sessions.removed} />
                </div>
                {changes.sessions.removed.some((s) => s.capacity && s.count >= s.capacity) && (
                  <Callout.Root>
                    <Callout.Icon>
                      <WarningIcon />
                    </Callout.Icon>
                    <Callout.Text>
                      You will be removed from a workshop that is currently full. If you change your
                      mind, the only way back in will be via the waitlist.
                    </Callout.Text>
                  </Callout.Root>
                )}
              </>
            )}

            {!isEmpty(changes.sessions.added) && (
              <div>
                <Text as="p" mb="2">
                  You will be added to the following{' '}
                  {pluralize('workshop', changes.sessions.added.length)}:
                </Text>
                <SessionList sessions={changes.sessions.added} />
              </div>
            )}
          </Flex>
          <Flex gap="4" mt="6">
            <Button size="3" variant="outline" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button size="3" variant="solid">
              Save changes
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </form>
  );
};

const useSelectedWorkshop = () => {
  const childMatches = useChildMatches();
  const { getWorkshop } = usePreferences();

  const [session, setSession] = useState<Workshop['sessions'][number] | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const close = useCallback(
    () => navigate({ to: '/register/workshops', replace: true }),
    [navigate]
  );

  useEffect(() => {
    const workshopMatch = childMatches.find(
      (match) => match.routeId === '/register/workshops/$slug'
    );

    if (workshopMatch && 'slug' in workshopMatch.params && 'session' in workshopMatch.search) {
      const workshop = getWorkshop(workshopMatch.params.slug);
      const session =
        workshop.sessions.find((s) => s.id === get(workshopMatch.search, 'session')) ?? null;
      setWorkshop(workshop);
      setSession(session);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [childMatches]);

  return { workshop, session, open, close };
};

const SessionList = ({ sessions }: { sessions: Session[] }) => (
  <ul className={classes.sessionList}>
    {sessions.map((session) => (
      <li key={session.id}>
        {session.capacity && session.count >= session.capacity ? <WarningIcon /> : <WorkshopIcon />}
        <Text>{session.workshop.name}</Text>
      </li>
    ))}
  </ul>
);
