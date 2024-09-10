import ChevronLeftIcon from '@/icons/ChevronLeftIcon';
import { Link as A, Box, Button, Flex, Heading, Portal, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import ReactCanvasConfetti from 'react-canvas-confetti';

import Image from './completed.svg';

import { RegistrationPhase } from '@/graphql/types';
import { useRegistration } from '@/services/Registration';
import classes from './Registration.module.css';

export const Completed = () => {
  const { phase } = useRegistration();

  return (
    <>
      <div className={clsx(classes.page)}>
        <div />
        <Flex direction="column" gap="4" align="start" maxWidth="40rem">
          <Box asChild maxWidth="20rem">
            <img src={Image} alt="Two friends who are excited to be coming to NZIF" />
          </Box>
          <Heading size="8">You’re coming to NZIF!</Heading>
          <Text as="p" size={{ initial: '3', md: '4' }}>
            Check your email for confirmation of your registration.{' '}
            {phase === RegistrationPhase.Earlybird && (
              <>
                We’ll be in touch again after 1&nbsp;September to let you know which workshops
                you’ve been allocated.{' '}
              </>
            )}{' '}
            If you have any questions, please reach out to Matt at{' '}
            <A href="mailto:registrations@improvfest.nz">registrations@improvfest.nz</A>.
          </Text>
          <Text as="p" size={{ initial: '3', md: '4' }}>
            In the meantime, why not join the other cool kids in the{' '}
            <A
              href="https://www.facebook.com/groups/NZIFGreenRoom"
              target="_blank"
              rel="noopener noreferrer"
            >
              NZIF Green Room
            </A>
            , or get your hands on some sweet{' '}
            <A
              href="https://improvfest.printmighty.co.nz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NZIF merch
            </A>
            ?
          </Text>
          <Button asChild size="3">
            <Link to="/">
              <ChevronLeftIcon />
              Back to main site
            </Link>
          </Button>
        </Flex>
        <div />
      </div>
      <Portal>
        <ReactCanvasConfetti
          onInit={({ confetti }) => {
            const colors = ['#E93D82', '#00A2C7', '#FFE629'];

            setTimeout(() => {
              confetti({
                colors,
                spread: 26,
                startVelocity: 55,
                origin: { y: 0.5 },
                particleCount: Math.floor(200 * 0.25),
              });
              confetti({
                colors,
                spread: 60,
                origin: { y: 0.5 },
                particleCount: Math.floor(200 * 0.2),
              });
              confetti({
                colors,
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
                origin: { y: 0.5 },
                particleCount: Math.floor(200 * 0.35),
              });
              confetti({
                colors,
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
                origin: { y: 0.5 },
                particleCount: Math.floor(200 * 0.1),
              });
              confetti({
                colors,
                spread: 120,
                startVelocity: 45,
                origin: { y: 0.5 },
                particleCount: Math.floor(200 * 0.1),
              });
            }, 300);
          }}
        />
      </Portal>
    </>
  );
};
