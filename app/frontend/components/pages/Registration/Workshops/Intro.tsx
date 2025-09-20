import { Button, Callout, Heading, Link, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { RegistrationPhase } from '@/graphql/types';
import { useRegistration } from '@/services/Registration';
import { useWorkshopExplainer } from './useWorkshopExplainer';
import { WaitlistExplainer } from './WaitlistExplainer';

export const Intro: React.FC = () => {
  const { phase } = useRegistration();

  const [Explainer, { show: showExplainer }] = useWorkshopExplainer();

  const [showWaitlistExplainer, setShowWaitlistExplainer] = useState(false);

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
              before preferential registration closes on 3 August; you will not be charged for any
              workshops until initial placements are confirmed in early August.
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
        <Callout.Root>
          <Callout.Text>
            <Heading as="h1" size="6">
              Registrations paused
            </Heading>
            <p>
              Workshop selection is currently paused. You can still view the workshops below, but
              you won’t be able to select any until registration reopens in a day or two.
            </p>
          </Callout.Text>
        </Callout.Root>
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
          <p>
            If you need to withdraw from a workshop less than 48 hours before it starts, we cannot
            offer refunds. In the event of illness or emergency, please contact us at{' '}
            <Link href="mailto:registrations@improvfest.nz">registrations@improvfest.nz</Link> or
            see a team member at the Festival.
          </p>
          <DoubleWorkshopNote />
          <Button
            type="button"
            variant="outline"
            size="2"
            onClick={() => setShowWaitlistExplainer(true)}
          >
            How waitlists work
          </Button>
          <WaitlistExplainer open={showWaitlistExplainer} onOpenChange={setShowWaitlistExplainer} />
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
