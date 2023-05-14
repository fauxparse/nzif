import React, { forwardRef, useEffect, useId, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import { useInterpret, useSelector } from '@xstate/react';
import clsx from 'clsx';
import { isEqual, map } from 'lodash-es';

import InputGroup from '../InputGroup';
import Menu from '../Menu';
import Input, { InputSize } from '@/atoms/Input';
import AutoResize from '@/helpers/AutoResize';

import Chip from './Chip';
import PersonPickerContext from './Context';
import { PersonPickerProps, Profile } from './PersonPicker.types';
import PersonPickerMachine, { Context, NEW_PERSON } from './PersonPickerMachine';

import './PersonPicker.css';

export const PersonPicker = forwardRef(
  <T extends Profile = Profile>(
    {
      className,
      value = [],
      placeholder,
      onChange,
      onSearch,
      onCreate,
      ...props
    }: PersonPickerProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const uniqueId = useId();

    const machine = useInterpret(PersonPickerMachine, {
      context: {
        people: value,
        activeIndex: null,
        menuIndex: null,
        inputRef,
      },
      actions: {},
      services: {
        search: ({ currentSearch }) => onSearch(currentSearch),
        addNewPerson: ({ results, menuIndex }) =>
          new Promise<T>((resolve, reject) => {
            if (menuIndex === null) return reject();
            onCreate(results[menuIndex] as T).then(resolve);
          }),
      },
    });

    const state = useSelector(machine, (state) => state);

    const { people, activeIndex, menuIndex, results } = state.context as Context<T>;

    const valueRef = useRef(value);

    valueRef.current = value;

    useEffect(() => {
      if (
        !isEqual(map(valueRef.current, 'id'), map(people, 'id')) &&
        !people.find((p) => 'temp' in p)
      ) {
        onChange(people);
      }
    }, [people, onChange]);

    const isExpanded = state.matches('menu.expanded');

    const setExpanded = (expanded: boolean) => {
      machine.send(expanded ? 'EXPAND' : 'COLLAPSE');
    };

    const listRef = useRef<Array<HTMLElement | null>>([]);

    const { refs, x, y, strategy, context } = useFloating<HTMLInputElement>({
      whileElementsMounted: autoUpdate,
      open: isExpanded,
      onOpenChange: setExpanded,
      middleware: [
        offset(8),
        flip({ padding: 16 }),
        size({
          apply({ rects, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
          padding: 16,
        }),
      ],
    });

    const role = useRole(context, { role: 'listbox' });
    const dismiss = useDismiss(context);
    const listNav = useListNavigation(context, {
      listRef,
      activeIndex: menuIndex,
      virtual: true,
      onNavigate: (index: number | null) => {
        if (index === null) {
          inputRef.current?.focus();
        } else {
          machine.send({ type: 'SET_MENU_INDEX', index });
        }
      },
      loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      role,
      dismiss,
      listNav,
    ]);

    const choose = (person: T) => {
      machine.send({ type: 'ADD', person });
      machine.send('COLLAPSE');
    };

    const keyDown = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') e.preventDefault();
      machine.send({ type: 'KEY_PRESS', key: e.key });
    };

    return (
      <PersonPickerContext.Provider value={{ machine, uniqueId }}>
        <Input
          as="div"
          size={InputSize.MEDIUM}
          className={clsx('person-picker', className)}
          tabIndex={0}
          aria-activedescendant={
            activeIndex === null ? undefined : `${uniqueId}${people[activeIndex].id}`
          }
          onClick={() => inputRef.current?.focus()}
          {...getReferenceProps({
            ref: mergeRefs([ref, refs.setReference]),
            onKeyDown: keyDown,
            onFocus: () => inputRef.current?.select(),
          })}
          {...props}
        >
          {people.map((person, index) => (
            <Chip key={person.id} person={person} active={activeIndex === index} />
          ))}
          <InputGroup>
            <InputGroup.Icon name="userAdd" />
            <AutoResize>
              <input
                ref={inputRef}
                placeholder={!people.length ? placeholder : undefined}
                className="person-picker__input"
                onInput={(e) => machine.send({ type: 'SEARCH', query: e.currentTarget.value })}
              />
            </AutoResize>
          </InputGroup>
        </Input>
        <FloatingPortal>
          {isExpanded && (
            <Menu
              className="person-picker__menu"
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                },
              })}
            >
              {results.length === 0 && <Menu.Empty>(no results)</Menu.Empty>}
              {results.map((person, index) => (
                <Menu.Item
                  key={person.id}
                  {...getItemProps({
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      choose(person);
                    },
                  })}
                  selected={menuIndex === index}
                  label={person.id === NEW_PERSON ? `Add ‘${person.name}’` : person.name}
                  icon={person.id === NEW_PERSON ? 'new' : 'user'}
                />
              ))}
            </Menu>
          )}
        </FloatingPortal>
      </PersonPickerContext.Provider>
    );
  }
);

PersonPicker.displayName = 'PersonPicker';

export default PersonPicker;
