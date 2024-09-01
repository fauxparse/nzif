import * as RadixAccordion from '@radix-ui/react-accordion';
import type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionSingleProps,
  AccordionTriggerProps,
} from '@radix-ui/react-accordion';
import clsx from 'clsx';
import { ComponentPropsWithRef, forwardRef } from 'react';

import classes from './Accordion.module.css';

const Root = forwardRef(
  <T extends AccordionSingleProps | AccordionMultipleProps>(
    props: T,
    ref: ComponentPropsWithRef<'div'>['ref']
  ) => (
    <RadixAccordion.Root
      ref={ref}
      {...props}
      className={clsx(classes.AccordionRoot, props.className)}
    />
  )
);

const Item = forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => (
  <RadixAccordion.Item
    ref={ref}
    {...props}
    className={clsx(classes.AccordionItem, props.className)}
  />
));

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>((props, ref) => (
  <RadixAccordion.Trigger
    ref={ref}
    {...props}
    className={clsx(classes.AccordionTrigger, props.className)}
  />
));

const Header = forwardRef<HTMLHeadingElement, AccordionHeaderProps>((props, ref) => (
  <RadixAccordion.Header
    ref={ref}
    {...props}
    className={clsx(classes.AccordionHeader, props.className)}
  />
));

const Content = forwardRef<HTMLDivElement, AccordionContentProps>(({ children, ...props }, ref) => (
  <RadixAccordion.Content
    ref={ref}
    {...props}
    className={clsx(classes.AccordionContent, props.className)}
  >
    <div className={classes.AccordionContentInner}>{children}</div>
  </RadixAccordion.Content>
));

export const Accordion = {
  ...RadixAccordion,
  Root,
  Item,
  Trigger,
  Header,
  Content,
};
