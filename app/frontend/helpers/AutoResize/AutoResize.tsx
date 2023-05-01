import {
  Children,
  cloneElement,
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  isValidElement,
  ReactElement,
  useLayoutEffect,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import { get, throttle } from 'lodash-es';

import { PolymorphicRef } from '@/types/polymorphic.types';

import { AutoResizeProps, OFFSET, SCROLL } from './AutoResize.types';

import './AutoResize.css';

const isInputElement = (element: HTMLElement): element is HTMLInputElement | HTMLTextAreaElement =>
  element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';

export const AutoResize = forwardRef(
  <T extends ElementType>(
    { children, dimension, onResize }: AutoResizeProps<T>,
    passedRef: PolymorphicRef<T>
  ): ReactElement => {
    const child = Children.only(children);

    const [component, setComponent] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
      if (!component) return;

      const d = dimension || (component.tagName === 'INPUT' ? 'width' : 'height');
      const offsetDimension = OFFSET[d];
      const scrollDimension = SCROLL[d];
      const parent = (component.closest('[data-resize-wrapper]') || component) as HTMLElement;

      const resize = throttle(
        () => {
          const placeholder =
            isInputElement(component) && !component.value && component.placeholder;

          parent.style.removeProperty(d);
          component.style.removeProperty(d);
          parent.style.flex = '1 1 0';
          const max = parent[offsetDimension];
          parent.style.removeProperty('flex');
          const hasMax = max !== component[offsetDimension];

          const current = component[offsetDimension];

          component.style[d] = '0';
          parent.style[d] = '0';
          if (placeholder) component.value = placeholder;

          // Give it a bit of extra gap so that it doesn't jump around while typing
          const extra = d === 'width' && !placeholder ? 16 : 4;
          const auto = component[scrollDimension] + extra;
          component.style.removeProperty(d);
          parent.style.removeProperty(d);

          if (placeholder) component.value = '';

          /* c8 ignore next */
          const resized = Math.min(hasMax ? max : Infinity, auto);
          (d === 'width' ? parent : component).style[d] = `${resized}px`;
          if (resized !== current) onResize?.(component);
        },
        10,
        { leading: true, trailing: true }
      );

      const observer = new MutationObserver(resize);
      observer.observe(component, {
        subtree: true,
        attributeFilter: ['value'],
      });

      component.addEventListener('change', resize);
      component.addEventListener('input', resize);

      resize();

      return () => {
        observer.disconnect();
        component.removeEventListener('change', resize);
        component.removeEventListener('input', resize);
      };
    }, [component, dimension, onResize]);

    return (
      <>
        {isValidElement(child)
          ? cloneElement(child, {
              ref: mergeRefs([
                setComponent,
                passedRef,
                get(child, 'ref', null) as ComponentPropsWithRef<T>['ref'] | null,
              ]),
              'data-auto-resize': 'true',
              /* c8 ignore next */
            } as ComponentPropsWithRef<T>)
          : null}
      </>
    );
  }
);

AutoResize.displayName = 'AutoResize';

export default AutoResize;
