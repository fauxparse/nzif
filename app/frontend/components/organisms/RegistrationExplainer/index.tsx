import { Checkbox } from '@/components/atoms/Checkbox';
import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import ChevronLeftIcon from '@/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import CloseIcon from '@/icons/CloseIcon';
import { DialogProps } from '@radix-ui/react-dialog';
import {
  Box,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Inset,
  Link,
  Separator,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { AnimatePresence, MotionConfig, Variants, motion } from 'framer-motion';
import { useState } from 'react';

import Image1 from './1.svg';
import Image2 from './2.svg';
import Image3 from './3.svg';
import Image4 from './4.svg';
import Image5 from './5.svg';
import Image6 from './6.svg';
import classes from './RegistrationExplainer.module.css';

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
    id: 'allocation',
    content: (
      <Text as="p">
        Once this first phase of registration is complete, we use a complicated algorithm to
        semi-randomly assign workshop placements to everyone who has registered so far. There is{' '}
        <b>no AI involved</b> in this process!
      </Text>
    ),
    image: Image3,
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
    image: Image4,
  },
  {
    id: 'fairness',
    content: (
      <Text as="p">
        We aim to make the process as fair as possible, so that everyone has an equal chance of
        getting their top preferences.
      </Text>
    ),
    image: Image5,
  },
  {
    id: 'questions',
    content: (
      <Text as="p">
        If you have any questions about the registration process, please contact Matt at{' '}
        <Link href="mailto:registrations@improvfest.nz">registrations@improvfest.nz</Link>.
      </Text>
    ),
    image: Image6,
  },
];

const variants: Variants = {
  initial: (custom) => ({
    x: custom === 'left' ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (custom) => ({
    x: custom === 'left' ? '-100%' : '100%',
    opacity: 0,
  }),
};

type RegistrationExplainerProps = Omit<DialogProps, 'onOpenChange'> & {
  dontShowAgain?: boolean;
  onOpenChange: (value: boolean, dontShowAgain: boolean) => void;
};

export const RegistrationExplainer: React.FC<RegistrationExplainerProps> = ({
  dontShowAgain: initialDontShowAgain = false,
  onOpenChange,
  ...props
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(initialDontShowAgain ?? false);

  const [currentPage, setCurrentPage] = useState(0);

  const currentPageWas = usePreviousDistinct(currentPage);

  const page = PAGES[currentPage];

  const direction = currentPageWas === undefined || currentPageWas < currentPage ? 'left' : 'right';

  const previousPage = () => setCurrentPage((prev) => Math.max(0, prev - 1));

  const nextPage = () => setCurrentPage((prev) => Math.min(PAGES.length - 1, prev + 1));

  const openChanged = (open: boolean) => {
    onOpenChange(open, dontShowAgain);
  };

  return (
    <Dialog.Root {...props} onOpenChange={openChanged}>
      <Dialog.Content
        className={classes.dialog}
        size="2"
        maxWidth="30rem"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <Dialog.Title>Registration</Dialog.Title>
          <Dialog.Description>An explanation of the NZIF registration process</Dialog.Description>
        </VisuallyHidden>

        <Flex direction="column" gap="4">
          <Box className={classes.pages}>
            <MotionConfig transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  className={classes.page}
                  key={page.id}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={direction}
                >
                  <img src={page.image} alt="" />
                  {page.content}
                </motion.div>
              </AnimatePresence>
            </MotionConfig>
            <IconButton
              className={classes.navigation}
              type="button"
              rel="prev"
              size="4"
              variant="ghost"
              color="gray"
              radius="full"
              onClick={previousPage}
              disabled={!currentPage}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              className={classes.navigation}
              type="button"
              rel="next"
              size="4"
              variant="ghost"
              color="gray"
              radius="full"
              onClick={nextPage}
              disabled={currentPage === PAGES.length - 1}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Flex className={classes.dots}>
            {PAGES.map((page, index) => (
              <Box
                key={page.id}
                onClick={() => setCurrentPage(index)}
                className={classes.dot}
                data-active={currentPage === index}
              />
            ))}
          </Flex>

          <Inset side="x">
            <Separator size="4" />
          </Inset>
          <Flex asChild align="center" gap="2" justify="center">
            <label>
              <Checkbox
                size="2"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(!!checked)}
              />
              <span>Don’t show me this again</span>
            </label>
          </Flex>
        </Flex>

        <IconButton
          className={classes.close}
          variant="ghost"
          radius="full"
          color="gray"
          onClick={() => openChanged(false)}
        >
          <CloseIcon />
        </IconButton>
      </Dialog.Content>
    </Dialog.Root>
  );
};
