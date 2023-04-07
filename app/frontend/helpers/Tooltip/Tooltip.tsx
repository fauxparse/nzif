import React, {
  Children,
  cloneElement,
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  isValidElement,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  inline,
  offset,
  shift,
  useClick,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { get } from 'lodash-es';

import { TooltipComponent, TooltipHandle, TooltipProps } from './Tooltip.types';

import './Tooltip.css';

const offsetDistance = 8;

export const Tooltip: TooltipComponent = forwardRef(
  <T extends ElementType>(
    {
      content,
      placement: preferredPlacement = 'top',
      open,
      trigger = ['hover', 'focus', 'manual'],
      children,
    }: TooltipProps<T>,
    ref: Ref<TooltipHandle>
  ) => {
    const child = Children.only(children);

    const delayGroupId = useId();

    const arrowRef = useRef<HTMLSpanElement>(null);

    const { delay } = useDelayGroupContext();

    const [isOpen, setIsOpen] = useState(false);

    const triggers = useMemo(
      () => new Set(Array.isArray(trigger) ? trigger : [trigger]),
      [trigger]
    );

    useEffect(() => {
      if (open === undefined) return;
      setIsOpen(open);
    }, [open]);

    const { x, y, strategy, refs, context, placement, middlewareData, update } = useFloating({
      open: isOpen,
      placement: preferredPlacement,
      onOpenChange: (x) => setIsOpen(open || x),
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(offsetDistance),
        flip(),
        shift(),
        inline(),
        arrow({ element: arrowRef.current as HTMLElement, padding: 8 }),
      ],
    });

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]] as 'top' | 'right' | 'bottom' | 'left';

    useDelayGroup(context, { id: delayGroupId });

    const hover = useHover(context, { delay, enabled: triggers.has('hover') });
    const click = useClick(context, { enabled: triggers.has('click') });
    const focus = useFocus(context, { enabled: triggers.has('focus') });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      click,
      focus,
      dismiss,
      role,
    ]);
    const { x: arrowX, y: arrowY } = middlewareData.arrow || {};

    useImperativeHandle(ref, () => ({ update }));

    return (
      <>
        {isValidElement(child)
          ? cloneElement(child, {
              ...getReferenceProps(),
              ref: mergeRefs([
                refs.setReference,
                get(child, 'ref', null) as ComponentPropsWithRef<T>['ref'] | null,
              ]),
              'data-auto-resize': 'true',
              /* c8 ignore next */
            } as ComponentPropsWithRef<T>)
          : null}
        <FloatingPortal>
          <AnimatePresence>
            {isOpen && content && (
              <motion.div
                className="tooltip"
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                }}
                data-placement={placement}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.3 } }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                {...getFloatingProps()}
              >
                {content}
                <span
                  ref={arrowRef}
                  className="tooltip__arrow"
                  style={{
                    left: arrowX != null ? `${arrowX}px` : '',
                    top: arrowY != null ? `${arrowY}px` : '',
                    right: '',
                    bottom: '',
                    [staticSide]: '-4px',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
