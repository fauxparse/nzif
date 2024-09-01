import ChevronDownIcon from '@/icons/ChevronDownIcon';
import { StoryDefault } from '@ladle/react';
import { AccordionTriggerProps } from '@radix-ui/react-accordion';
import React, { ComponentPropsWithoutRef } from 'react';
import { Accordion } from '.';

const AccordionDemo = () => (
  <Accordion.Root type="single" defaultValue="item-1" collapsible>
    <Accordion.Item value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item value="item-2">
      <AccordionTrigger>Is it unstyled?</AccordionTrigger>
      <AccordionContent>
        Yes. It's unstyled by default, giving you freedom over the look and feel.
      </AccordionContent>
    </Accordion.Item>

    <Accordion.Item value="item-3">
      <AccordionTrigger>Can it be animated?</AccordionTrigger>
      <Accordion.Content>
        <div className="AccordionContentText">
          Yes! You can animate the Accordion with CSS or JavaScript.
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, forwardedRef) => (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger {...props} ref={forwardedRef}>
        {children}
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content {...props} ref={forwardedRef}>
      <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
  )
);

export { AccordionDemo as Accordion };

export default {
  title: 'Molecules',
} satisfies StoryDefault;
