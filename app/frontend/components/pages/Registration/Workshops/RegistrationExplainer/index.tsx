import { Explainer, ExplainerProps } from '@/components/organisms/Explainer';
import { Heading, Link, Text } from '@radix-ui/themes';

import Image1 from './1.svg';
import Image2 from './2.svg';
import Image3 from './3.svg';
import Image4 from './4.svg';
import Image5 from './5.svg';
import Image6 from './6.svg';
import Image7 from './7.svg';

const PAGES = [
  {
    id: 'welcome',
    content: (
      <>
        <Heading size="4">Welcome to preferential registration!</Heading>
        <Text as="p">
          In order to ensure fair access to workshop places, the first phase of our registration
          process asks participants to list their preferences for each workshop slot.
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
          You can list as many preferences as you like for each slot. The more preferences you list,
          the more likely you are to get a place in a workshop.
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
          Because we have both full-day and half-day workshops on some days, there might be some
          gaps in your numbers. For example, this person would rather do the green morning workshop
          than the blue one, but would prefer the full-day workshop to the pink afternoon one.
        </Text>
      </>
    ),
    image: Image3,
  },
  {
    id: 'allocation',
    content: (
      <Text as="p">
        Once this first phase of registration is complete, we use a complicated algorithm to
        semi-randomly assign workshop placements to everyone who has registered so far. There is{' '}
        <b>no AI involved</b> in this process!
      </Text>
    ),
    image: Image4,
  },
  {
    id: 'payment',
    content: (
      <Text as="p">
        Once we’ve allocated all the workshop places, we’ll let you know which workshops you’re in,
        and the full payment will be due. You’ll automatically be placed on a waitlist for any
        workshops you didn’t get into.
      </Text>
    ),
    image: Image5,
  },
  {
    id: 'fairness',
    content: (
      <Text as="p">
        We aim to make the process as fair as possible, so that everyone has an equal chance of
        getting their top preferences.
      </Text>
    ),
    image: Image6,
  },
  {
    id: 'questions',
    content: (
      <Text as="p">
        If you have any questions about the registration process, please contact Matt at{' '}
        <Link href="mailto:registrations@improvfest.nz">registrations@improvfest.nz</Link>.
      </Text>
    ),
    image: Image7,
  },
];

export const RegistrationExplainer: React.FC<
  Omit<ExplainerProps, 'title' | 'description' | 'pages'>
> = (props) => (
  <Explainer
    {...props}
    title="Registration"
    description="An explanation of the NZIF registration process"
    pages={PAGES}
  />
);
