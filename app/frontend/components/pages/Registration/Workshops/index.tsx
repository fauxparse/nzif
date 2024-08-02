import { useRegistration } from '@/services/Registration';
import { useMutation } from '@apollo/client';
import { Button, Heading, Section, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { Buttons } from '../Buttons';
import registrationClasses from '../Registration.module.css';
import { Day } from './Day';
import { usePreferences } from './WorkshopPreferencesProvider';
import { SaveWorkshopPreferencesMutation } from './queries';
import { useWorkshopExplainer } from './useWorkshopExplainer';

import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const { registration, loading: registrationLoading, goToNextStep } = useRegistration();

  const { days, loading, dirty, value } = usePreferences();

  const [Explainer, { show: showExplainer }] = useWorkshopExplainer();

  const [save] = useMutation(SaveWorkshopPreferencesMutation);

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
        <p>
          <Text color="gray">
            <b>Note:</b> This year we have a number of ‘full-day’ workshops. These will run in two
            sessions, from 10:00–1:00 and 2:00–5:00; accordingly, they are charged as two workshops
            on your registration.
          </Text>
        </p>
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

      <Buttons disabled={loading || registrationLoading} />
    </form>
  );
};
