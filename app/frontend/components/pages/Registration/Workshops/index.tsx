import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { Section } from '@radix-ui/themes';
import { useChildMatches } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { get } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { Buttons } from '../Buttons';
import registrationClasses from '../Registration.module.css';
import { Day } from './Day';
import { WorkshopDetails } from './WorkshopDetails';
import { usePreferences } from './WorkshopPreferencesProvider';
import { SaveWorkshopPreferencesMutation } from './queries';
import { Workshop } from './types';

import { RegistrationPhase } from '@/graphql/types';
import { Intro } from './Intro';
import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const { registration, phase, loading: registrationLoading, goToNextStep } = useRegistration();

  const { days, loading, dirty, value, disabledSessions } = usePreferences();

  const [save] = useMutation(SaveWorkshopPreferencesMutation);

  const { workshop, session, open, close } = useSelectedWorkshop();

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
        saveAndContinue();
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
      const workshop = getWorkshop(workshopMatch.params.slug) ?? null;
      const session =
        workshop?.sessions.find((s) => s.id === get(workshopMatch.search, 'session')) ?? null;
      setWorkshop(workshop);
      setSession(session);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [childMatches]);

  return { workshop, session, open, close };
};
