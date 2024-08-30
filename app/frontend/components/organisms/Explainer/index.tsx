import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import ChevronLeftIcon from '@/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import CloseIcon from '@/icons/CloseIcon';
import { DialogProps } from '@radix-ui/react-dialog';
import {
  Box,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  Inset,
  Separator,
  VisuallyHidden,
} from '@radix-ui/themes';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

import classes from './Explainer.module.css';

type Page = {
  id: string;
  content: ReactNode;
  image: string;
};

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

export type ExplainerProps = Omit<DialogProps, 'onOpenChange'> & {
  title: string;
  description: string;
  pages: readonly Page[];
  dismissible?: true;
  dontShowAgain?: boolean;
  onOpenChange: (open: boolean, dontShowAgain: boolean) => void;
};

export const Explainer: React.FC<ExplainerProps> = ({
  title,
  description,
  pages,
  dismissible,
  dontShowAgain: initialDontShowAgain = false,
  open,
  onOpenChange,
  children,
  ...props
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(initialDontShowAgain ?? false);

  const [currentPage, setCurrentPage] = useState(0);

  const currentPageWas = usePreviousDistinct(currentPage);

  const page = pages[currentPage];

  const direction = currentPageWas === undefined || currentPageWas < currentPage ? 'left' : 'right';

  const previousPage = () => setCurrentPage((prev) => Math.max(0, prev - 1));

  const nextPage = () => setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));

  const openChanged = (open: boolean) => {
    onOpenChange(open, dontShowAgain);
  };

  useEffect(() => {
    if (!open) setCurrentPage(0);
  }, [open]);

  return (
    <Dialog.Root {...props} open={open} onOpenChange={openChanged}>
      <Dialog.Content className={classes.dialog} size="2" maxWidth="30rem">
        <VisuallyHidden>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </VisuallyHidden>

        <Flex direction="column" gap="4">
          <Box className={classes.pages}>
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
              disabled={currentPage === pages.length - 1}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Flex className={classes.dots}>
            {pages.map((page, index) => (
              <Box
                key={page.id}
                onClick={() => setCurrentPage(index)}
                className={classes.dot}
                data-active={currentPage === index}
              />
            ))}
          </Flex>

          {children}

          {dismissible && (
            <>
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
            </>
          )}
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
