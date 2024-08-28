import { RegistrationPhase } from '@/graphql/types';
import { useRegistration } from '@/services/Registration';
import { Button, Callout, Heading, Text } from '@radix-ui/themes';
import { useWorkshopExplainer } from './useWorkshopExplainer';

export const Intro: React.FC = () => {
  const { phase } = useRegistration();

  const [Explainer, { show: showExplainer }] = useWorkshopExplainer();

  switch (phase) {
    case RegistrationPhase.Earlybird:
      return (
        <>
          <Heading as="h1" size="6">
            Workshop preferences
          </Heading>
          <p>
            <Text size={{ initial: '3', md: '4' }}>
              Select your preferred workshops below. You can change your preferences at any time
              before preferential registration closes on 1 September; you will not be charged for
              any workshops until initial placements are confirmed in early September.
            </Text>
          </p>
          <DoubleWorkshopNote />
          <Button type="button" variant="outline" size="2" onClick={showExplainer}>
            How registration works
          </Button>
          <Explainer />
        </>
      );
    case RegistrationPhase.Paused:
      return (
        <>
          <Heading as="h1" size="6">
            Registrations paused
          </Heading>
          <p>
            Workshop selection is currently paused. You can still view the workshops below, but you
            won’t be able to select any until registration reopens in a day or two.
          </p>
        </>
      );
    default:
      return (
        <>
          <Heading as="h1" size="6">
            Workshop selection
          </Heading>
          <p>
            Select as many workshops as you like below. The more workshops you take, the bigger the
            discount. If a workshop is sold out, you can join the waitlist; in the event that a
            place becomes available, you’ll be notified by email and/or text message, and removed
            from any other workshops you may be in at the same time.
          </p>
          <DoubleWorkshopNote />
        </>
      );
  }
};

const DoubleWorkshopNote = () => (
  <Callout.Root mb="4" size="2">
    <Callout.Text>
      <b>Note:</b> This year we have a number of ‘full-day’ workshops. These will run in two
      sessions, from 10:00–1:00 and 2:00–5:00; accordingly, they are charged as two workshops on
      your registration.
    </Callout.Text>
  </Callout.Root>
);
