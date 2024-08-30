import { Explainer, ExplainerProps } from '@/components/organisms/Explainer';
import { Link, Text } from '@radix-ui/themes';

import Image1 from './1.svg';
import Image2 from './2.svg';
import Image3 from './3.svg';
import Image4 from './4.svg';

const PAGES = [
  {
    id: 'welcome',
    content: (
      <>
        <Text as="p">
          So your friends all got into their first choice workshop and you didn’t? Here’s how our
          waitlist system works.
        </Text>
      </>
    ),
    image: Image1,
  },
  {
    id: 'preferences',
    content: (
      <>
        <Text as="p">
          You’re automatically added to the waitlist for any workshop you ranked higher than the one
          you got into. You can also join the waitlists for any other workshops.
        </Text>
        <Text as="p">
          If you’re happy with what you’ve got, make sure you remove yourself from other waitlists
          so you don’t accidentally get moved out.
        </Text>
      </>
    ),
    image: Image2,
  },
  {
    id: 'slots',
    content: (
      <>
        <Text as="p">
          If a spot opens up in a workshop you’re on the waitlist for, you’ll be automatically moved
          into it, and removed from any other workshops you’re in at the same time. Make sure you
          check your calendar regularly so you’re in the right place at the right time.
        </Text>
      </>
    ),
    image: Image3,
  },
  {
    id: 'questions',
    content: (
      <Text as="p">
        If you have any questions about the registration process, please contact Matt at{' '}
        <Link href="mailto:registrations@improvfest.nz">registrations@improvfest.nz</Link>.
      </Text>
    ),
    image: Image4,
  },
];

export const WaitlistExplainer: React.FC<
  Omit<ExplainerProps, 'title' | 'description' | 'pages'>
> = ({ dismissible, ...props }) => (
  <Explainer
    {...props}
    title="Registration"
    description="An explanation of the NZIF registration process"
    pages={PAGES}
  />
);
