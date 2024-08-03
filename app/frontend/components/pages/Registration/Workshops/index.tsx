import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { Button, Callout, Heading, Section, Text } from '@radix-ui/themes';
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
import { useWorkshopExplainer } from './useWorkshopExplainer';

import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const { registration, loading: registrationLoading, goToNextStep } = useRegistration();

  const { days, loading, dirty, value } = usePreferences();

  const [Explainer, { show: showExplainer }] = useWorkshopExplainer();

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
      <Section maxWidth="40em">
        <Heading as="h1" size="6">
          Workshop preferences
        </Heading>
        <p>
          <Text size={{ initial: '3', md: '4' }}>
            Select your preferred workshops below. You can change your preferences at any time
            before preferential registration closes on 31 August; you will not be charged for any
            workshops until initial placements are confirmed in September.{' '}
          </Text>
        </p>
        <Callout.Root mb="4" size="2">
          <Callout.Text>
            <b>Note:</b> This year we have a number of ‘full-day’ workshops. These will run in two
            sessions, from 10:00–1:00 and 2:00–5:00; accordingly, they are charged as two workshops
            on your registration.
          </Callout.Text>
        </Callout.Root>
        <Button type="button" variant="outline" size="2" onClick={showExplainer}>
          How registration works
        </Button>
      </Section>

      <div>
        {days.map((day) => (
          <Day key={day.date.toISODate()} date={day.date} workshops={day.workshops} />
        ))}
      </div>

      <Explainer />

      {workshop && (
        <WorkshopDetails open={open} workshop={workshop} session={session} onClose={close} />
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
