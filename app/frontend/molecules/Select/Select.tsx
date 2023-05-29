import React, { ElementType, forwardRef, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { mergeRefs } from 'react-merge-refs';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  inner,
  offset,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import clsx from 'clsx';

import Menu from '../Menu';
import Button from '@/atoms/Button';
import { PolymorphicRef } from '@/types/polymorphic.types';

import SelectContext from './Context';
import ScrollArrow from './ScrollArrow';
import { isSeparator, SelectOption, SelectProps } from './Select.types';
import DefaultTrigger from './Trigger';

import './Select.css';

export const Select = forwardRef(
  <V = string, T extends SelectOption<V> = SelectOption<V>, C extends ElementType = typeof Button>(
    {
      as,
      className,
      options,
      value,
      placeholder = 'Select…',
      onChange,
      ...props
    }: SelectProps<V, T, C>,
    ref: PolymorphicRef<C>
  ) => {
    const Trigger = (as || DefaultTrigger) as ElementType;

    const [open, setOpen] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(() =>
      options.findIndex((o) => !isSeparator(o) && o.value === value)
    );
    useEffect(() => {
      setSelectedIndex(options.findIndex((o) => !isSeparator(o) && o.value === value));
    }, [options, value]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [innerOffset, setInnerOffset] = useState(0);
    const [touch, setTouch] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [blockSelection, setBlockSelection] = useState(false);
    const [fallback, setFallback] = useState(false);
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const listContentRef = useRef<Array<string | null>>([]);
    const overflowRef = useRef<SideObject>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const allowSelectRef = useRef(false);
    const allowMouseUpRef = useRef(true);
    const selectTimeoutRef = useRef<number>();

    const hasIcon = !!(props as Record<string, unknown>)['icon'];

    const selectedItem =
      selectedIndex !== undefined && selectedIndex !== null && !isSeparator(options[selectedIndex])
        ? options[selectedIndex]
        : null;
    const label = (!isSeparator(selectedItem) && selectedItem?.label) || undefined;

    if (!open) {
      if (innerOffset !== 0) setInnerOffset(0);
      if (fallback) setFallback(false);
      if (blockSelection) setBlockSelection(false);
    }

    const { x, y, strategy, refs, context, isPositioned } = useFloating({
      placement: 'bottom-start',
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: fallback
        ? [
            offset(4),
            touch ? shift({ crossAxis: true, padding: 10 }) : flip({ padding: 10 }),
            size({
              apply({ rects, elements, availableHeight }) {
                Object.assign(scrollRef.current?.style ?? {}, {
                  maxHeight: `${availableHeight}px`,
                });
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
              padding: 16,
            }),
          ]
        : [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width + (hasIcon ? 4 : 28)}px`,
                });
              },
            }),
            inner({
              listRef,
              overflowRef,
              scrollRef,
              index: selectedIndex ?? 0,
              offset: innerOffset,
              onFallbackChange: setFallback,
              padding: 10,
              minItemsVisible: touch ? 8 : 4,
              referenceOverflowThreshold: 20,
            }),
            offset({ crossAxis: hasIcon ? -4 : -28 }),
          ],
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      useClick(context, { event: 'mousedown' }),
      useDismiss(context),
      useRole(context, { role: 'listbox' }),
      useListNavigation(context, {
        listRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
      }),
      useInnerOffset(context, {
        enabled: !fallback,
        onChange: setInnerOffset,
        overflowRef,
        scrollRef,
      }),
      useTypeahead(context, {
        listRef: listContentRef,
        activeIndex,
        onMatch: open ? setActiveIndex : setSelectedIndex,
      }),
    ]);

    useEffect(() => {
      if (open) {
        selectTimeoutRef.current = window.setTimeout(() => {
          allowSelectRef.current = true;
        }, 300);

        return () => {
          clearTimeout(selectTimeoutRef.current);
        };
      } else {
        allowSelectRef.current = false;
        allowMouseUpRef.current = true;
      }
    }, [open]);

    const triggerRef = mergeRefs([ref, refs.setReference]);

    const select = (value: V) => {
      const index = options.findIndex((option) => !isSeparator(option) && option.value === value);
      if (index > -1) {
        setSelectedIndex(index);
        onChange(value);
        setOpen(false);
        (refs.reference.current as HTMLElement)?.focus();
      }
    };

    const handleArrowScroll = (amount: number) => {
      if (fallback) {
        if (scrollRef.current) {
          scrollRef.current.scrollTop -= amount;
          flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0));
        }
      } else {
        flushSync(() => setInnerOffset((value) => value - amount));
      }
    };

    const handleArrowHide = () => {
      if (touch) {
        clearTimeout(selectTimeoutRef.current);
        setBlockSelection(true);
        selectTimeoutRef.current = window.setTimeout(() => {
          setBlockSelection(false);
        }, 400);
      }
    };

    return (
      <SelectContext.Provider value={{ open, label, placeholder }}>
        <Trigger
          className={clsx('select', 'input', className)}
          {...getReferenceProps({
            ref: triggerRef,
            onTouchStart() {
              setTouch(true);
            },
            onPointerMove({ pointerType }) {
              if (pointerType === 'mouse') {
                setTouch(false);
              }
            },
          })}
          data-empty={value === undefined || undefined}
          aria-expanded={open}
          {...props}
        />
        <FloatingPortal>
          {open && (
            <FloatingOverlay style={{ zIndex: 30 }}>
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    outline: 'none',
                  }}
                >
                  <Menu
                    ref={scrollRef}
                    className="select__menu"
                    {...getFloatingProps({
                      onScroll({ currentTarget }) {
                        setScrollTop(currentTarget.scrollTop);
                      },
                      onContextMenu(e) {
                        e.preventDefault();
                      },
                    })}
                  >
                    {options.map((option, i) =>
                      isSeparator(option) ? (
                        <Menu.Separator key={i} />
                      ) : (
                        <Menu.Item
                          className="select__option"
                          icon={value === option.value ? 'check' : undefined}
                          key={String(option.value)}
                          label={option.label}
                          disabled={option.disabled || blockSelection || undefined}
                          selected={value === option.value}
                          role="option"
                          tabIndex={activeIndex === i ? 0 : -1}
                          onClick={() => setOpen(false)}
                          ref={(node) => {
                            listRef.current[i] = node;
                            listContentRef.current[i] = option.label;
                          }}
                          {...getItemProps({
                            onTouchStart() {
                              allowSelectRef.current = true;
                              allowMouseUpRef.current = false;
                            },
                            onKeyDown() {
                              allowSelectRef.current = true;
                            },
                            onClick() {
                              if (allowSelectRef.current) {
                                select(option.value);
                              }
                            },
                            onMouseUp() {
                              if (!allowMouseUpRef.current) {
                                return;
                              }

                              if (allowSelectRef.current) {
                                select(option.value);
                              }

                              // On touch devices, prevent the element from
                              // immediately closing `onClick` by deferring it
                              clearTimeout(selectTimeoutRef.current);
                              selectTimeoutRef.current = window.setTimeout(() => {
                                allowSelectRef.current = true;
                              });
                            },
                          })}
                        />
                      )
                    )}
                  </Menu>
                  {(['up', 'down'] as const).map((dir) => (
                    <ScrollArrow
                      key={dir}
                      dir={dir}
                      scrollTop={scrollTop}
                      scrollRef={scrollRef}
                      innerOffset={innerOffset}
                      isPositioned={isPositioned}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                    />
                  ))}
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = 'Select';

export default Select;
