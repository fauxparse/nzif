import { KeyboardEvent, RefObject } from 'react';
import { uniqueId } from 'lodash-es';
import { assign, createMachine } from 'xstate';
import { choose } from 'xstate/lib/actions';

import { Maybe } from '@/graphql/types';

import { Profile } from './PersonPicker.types';

type TemporaryProfile = Profile & { temp?: string };

export const NEW_PERSON = 'new';

type KeyPress = {
  type: 'KEY_PRESS';
  key: KeyboardEvent['key'];
};

type Expand = {
  type: 'EXPAND';
};

type Collapse = {
  type: 'COLLAPSE';
};

type Delete = {
  type: 'DELETE';
  id: string;
};

type Add = {
  type: 'ADD';
  person: Profile;
};

type Reset = {
  type: 'RESET';
  value: Profile[];
};

type SetMenuIndex = {
  type: 'SET_MENU_INDEX';
  index: Maybe<number>;
};

type Search = {
  type: 'SEARCH';
  query: string;
};

type Event = KeyPress | Expand | Collapse | Delete | Add | Reset | SetMenuIndex | Search;

type Services = {
  search: { data: TemporaryProfile[] };
  addNewPerson: { data: TemporaryProfile };
};

export type Context<T extends TemporaryProfile = TemporaryProfile> = {
  people: T[];
  activeIndex: Maybe<number>;
  menuIndex: Maybe<number>;
  inputRef: RefObject<HTMLInputElement>;
  results: T[];
  currentSearch: string;
};

const PersonPickerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOh1wAdYBiAaQFEBNAfQAUAlegZS4G0AGALqJQFAPaxcAF1xj8IkAA9EAWgBsAJgAcJAKwBOfht27+AZgCMAFi0B2NQBoQAT1UWLGkhdO2zG-u4afrZaAL6hTmhYeISk5FTUACL0ADL0ACr0AsJIIOKSMnIKyggqZiEk+maGRiH8ViFmuk6upd4WehZqWgZqJl1malbhkRjksWR4VCS4EAA2YNQAgomJ2Qr50rLyuSXqVvwkat76IWpmWl0BLarlh4Nm-CZW-lY+IyBR48STlLAz80WKzWFhyogkWyKu1Uvn0lQaun8GiGtl0ZisN1KumsJCMfX4ti6IS0+l0Hy+MR+8X+6AgEAIUGoEDkYBm+AAbmIANasikEKlTGl0hkIAiczDoQr4bLrXKbKUKVplXS2Ei2N52ElqbpaLTlJx7NRw+wXAlqWz1DRWc7ksaU0ioMD4ACuZDEczm6CokGo9AAGqwlgA5NZCDYQhXQtoWfRWEhWU6DFWPCyXDSYi0kZF2C0abwafRaIa26L8h1O12Yd2e70QahcehLdgAYQAErLwQVtsU3Pw1Id+Fo8xoLWiQroMS43GYsy9U08ekaLL4yRFPnayyRHS63R6vbAfQ30swALL0IMAVWYAEkQ-6O3kI92oyp3Ii9Px9AWEz1P1pJ60-gzqmFiDDY2h2PmJbfOWO5gIoFDoPgEA+s2ADyKQpEsrANg+8rPqAezuJoap9uamjdISZiYuiaoqpcsbWI8Q59NB9pbhWJDwYhyGHhkp7nlet7JH6eFPlChEwl+Rw9FYTS6CSBhaJiVpxloASBCEHgqsMa58hM26utxSEoXWDAsBw3B8GGcriTsknRnYJBDn2NiIpazRTggclqCQfinAW1i2N+dhsZuhlcQhJl8U2bZiV2ElKKohgdB4-DmJqphFumXmvsiflZeaFzyXYGhhRMB7oAATjgAILPWjYtu2NmdpC9lJaUsJZtq+iGNqXR5hYmJyXGy7BXqVqWNYRblT8lU1dgdWLPFbU9qUQwzsiRp9ccmjuDR-6VH4CYaMOQQWASs2kPNtU3TEjLMoQbKcjyJD6XNYDVbdn0LSKYpiBKUoyi1j4Je1hrScuxjWhc5qpspXkTp4VjWMYtiklUAS6aMpYVT931ffdDWxc1YKg6tuStHJnhVFaX5nZYBIGrcoFZvRTQXJcepqFdJB3Xz+NEw2JO8KC4Zg2tZSs2jeporqqaDAdca0ydDMXbY4RrvgYgofAuTvUQ4sUw5r7lHCHhWkWJiDiYtiYuouqVKcE2GHmPS89SRuRibuozgYBbkfUE5WABqj9h02J5ha5imOUZV6RuEzUktXsER1Kiy3oX76IHbwh6HpTGLoRy2PYBhQ+c3Qe4KJC0vS+BQKniV7NUM72KXoFfpa1r200qrqgpIQ5zqeoawnuM-IZTfg9OlheKdNh9Fltv23mM7cxOaLdF+iLY+uE+wZW1b7pA0+Sx4erz5bS82yqmLdN1diaE8pygSqvMRcZvEQGfL4XSjegbBPHRASC4pdMTuDhE0WMbtdSkiMBYXmd1f4+3VJUYw-5To9G8JoFSpx4zWnRn0OBLxfBIMFinWyEsXwsXQQpF42hsS6FwV5amR06anQtozMeOMYIC0Jvw36DcUHpwUr5C+2dQJc0Vqwvw7DVZcPVprUIQA */
    tsTypes: {} as import('./PersonPickerMachine.typegen').Typegen0,
    predictableActionArguments: true,

    schema: {
      context: {} as Context,
      events: {} as Event,
      services: {} as Services,
    },

    context: {
      people: [],
      activeIndex: null,
      menuIndex: null,
      inputRef: { current: null },
      results: [],
      currentSearch: '',
    },

    states: {
      chips: {
        on: {
          KEY_PRESS: [
            {
              target: 'chips',
              internal: true,
              actions: [
                choose([
                  {
                    cond: 'isLeftArrow',
                    actions: ['moveLeft', 'blurInput'],
                  },
                  {
                    cond: 'isRightArrow',
                    actions: ['moveRight', 'focusInput'],
                  },
                  {
                    cond: 'isDelete',
                    actions: ['deleteSelectedPerson', 'focusInput'],
                  },
                  {
                    cond: 'isBackspace',
                    actions: ['selectLastPerson', 'blurInput'],
                  },
                ]),
              ],
            },
          ],
          DELETE: [
            {
              target: 'chips',
              internal: true,
              actions: ['deletePerson', 'focusInput'],
            },
          ],
        },

        states: {
          idle: {
            on: {
              ADD: [
                {
                  cond: 'isNewPerson',
                  target: 'adding',
                  actions: ['addTemporaryPerson', 'clearInput', 'focusInput'],
                },
                {
                  target: 'idle',
                  internal: true,
                  actions: ['addPerson', 'clearInput', 'focusInput'],
                },
              ],
              RESET: [
                {
                  target: 'idle',
                  internal: true,
                  actions: ['resetValue', 'clearInput', 'focusInput'],
                },
              ],
            },
          },

          adding: {
            invoke: {
              src: 'addNewPerson',
              onDone: {
                target: 'idle',
                actions: ['addNewPerson'],
              },
            },
          },
        },

        initial: 'idle',
      },

      menu: {
        states: {
          collapsed: {
            on: {
              EXPAND: 'expanded',
              SEARCH: {
                cond: 'isLongEnough',
                target: 'expanded',
              },
              SET_MENU_INDEX: {
                target: 'expanded',
                actions: 'setMenuIndex',
              },
            },
          },

          expanded: {
            on: {
              COLLAPSE: 'collapsed',
              SET_MENU_INDEX: {
                target: 'expanded',
                internal: true,
                actions: 'setMenuIndex',
              },
              KEY_PRESS: [
                {
                  cond: 'isAddingNewPerson',
                  target: 'adding',
                  actions: ['addTemporaryPerson', 'clearInput', 'focusInput'],
                },
                {
                  cond: 'isEnter',
                  target: 'collapsed',
                  actions: ['addFromMenu', 'clearInput', 'focusInput'],
                },
              ],
              SEARCH: {
                cond: 'isNotLongEnough',
                target: 'collapsed',
              },
            },
          },

          adding: {
            invoke: {
              src: 'addNewPerson',
              onDone: {
                target: 'collapsed',
                actions: ['addNewPerson'],
              },
            },
          },
        },

        initial: 'collapsed',
      },

      search: {
        states: {
          idle: {
            on: {
              SEARCH: {
                target: 'searching',
                cond: 'isLongEnough',
                actions: 'setCurrentSearch',
              },
            },
            always: {
              target: 'searching',
              cond: 'hasPendingSearch',
              actions: 'updateCurrentSearch',
            },
          },

          searching: {
            invoke: {
              src: 'search',
              onDone: {
                target: 'idle',
                actions: 'setResults',
              },
            },
            on: {
              SEARCH: [
                {
                  target: 'searching',
                  cond: 'isLongEnough',
                  actions: ['cancelSearch', 'setCurrentSearch'],
                },
                {
                  target: 'idle',
                  actions: ['cancelSearch', 'setCurrentSearch'],
                },
              ],
            },
          },
        },

        initial: 'idle',
      },
    },

    type: 'parallel',
  },
  {
    guards: {
      isLeftArrow: ({ inputRef }, { key }) =>
        key === 'ArrowLeft' && inputRef.current?.selectionStart === 0,
      isRightArrow: ({ activeIndex }, { key }) => key === 'ArrowRight' && activeIndex !== null,
      isDelete: ({ activeIndex }, { key }) =>
        (key === 'Backspace' || key === 'Delete') && activeIndex !== null,
      isEnter: ({ menuIndex }, { key }) => key === 'Enter' && menuIndex !== null,
      isBackspace: ({ activeIndex, people, inputRef }, { key }) =>
        key === 'Backspace' &&
        activeIndex === null &&
        inputRef.current?.value === '' &&
        people.length > 0,
      isLongEnough: (_, { query }) => query.length > 2,
      isNotLongEnough: (_, { query }) => query.length < 3,
      hasPendingSearch: ({ currentSearch, inputRef }) =>
        currentSearch !== inputRef.current?.value && (inputRef.current?.value?.length || 0) > 2,
      isNewPerson: (_, { person }) => person.id === NEW_PERSON,
      isAddingNewPerson: ({ results, menuIndex }, { key }) =>
        key === 'Enter' && menuIndex !== null && results[menuIndex].id === NEW_PERSON,
    },
    actions: {
      moveLeft: assign({
        activeIndex: ({ activeIndex, people }) =>
          activeIndex === null ? people.length - 1 : Math.max(activeIndex - 1, 0),
      }),
      moveRight: assign({
        activeIndex: ({ activeIndex, people }) =>
          activeIndex === people.length - 1 ? null : (activeIndex ?? -1) + 1,
      }),
      blurInput: ({ inputRef }) => {
        (inputRef.current?.closest('.person-picker') as HTMLElement)?.focus();
      },
      focusInput: ({ inputRef, activeIndex }) => {
        if (activeIndex === null) {
          inputRef.current?.focus();
        }
      },
      clearInput: ({ inputRef }) => {
        if (!inputRef.current) return;
        inputRef.current.value = '';
      },
      deleteSelectedPerson: assign({
        people: ({ people, activeIndex }) => {
          const newPeople = [...people];
          newPeople.splice(activeIndex ?? -1, 1);
          return newPeople;
        },
        activeIndex: null,
      }),
      selectLastPerson: assign({
        activeIndex: ({ people }) => people.length - 1,
      }),
      deletePerson: assign({
        people: ({ people }, { id }) => people.filter((person) => person.id !== id),
      }),
      addPerson: assign({
        people: ({ people }, { person }) => [...people, person],
      }),
      addNewPerson: assign({
        people: ({ people }, { data: { temp, ...person } }) => {
          const newPeople = [...people];
          if (temp) {
            const index = people.findIndex((p) => p.temp === temp);
            if (index > -1) {
              newPeople.splice(index, 1, person);
              return newPeople;
            }
          }
          return [...people, person];
        },
      }),
      addTemporaryPerson: assign({
        people: ({ people, results, menuIndex }) => {
          if (menuIndex === null) return people;
          const { id, temp, ...rest } = results[menuIndex];
          return [...people, { id: temp ?? id, temp, ...rest }];
        },
      }),
      addFromMenu: assign({
        people: ({ people, results, menuIndex }) =>
          menuIndex === null ? people : [...people, results[menuIndex]],
      }),
      setMenuIndex: assign({
        menuIndex: (_, { index }) => index,
      }),
      setCurrentSearch: assign({
        currentSearch: (_, { query }) => query,
      }),
      updateCurrentSearch: assign({
        currentSearch: ({ inputRef }) => inputRef.current?.value ?? '',
      }),
      setResults: assign({
        results: ({ people, currentSearch }, { data }) => {
          const ids = new Set(people.map(({ id }) => id));
          return [
            ...data.filter(({ id }) => !ids.has(id)),
            ...(currentSearch.match(/[^\s]\s+[^\s]/)
              ? [{ id: NEW_PERSON, name: currentSearch, temp: uniqueId(), picture: null }]
              : []),
          ];
        },
      }),
      resetValue: assign({
        people: (_, { value }) => value,
      }),
      cancelSearch: () => void 0,
    },
    services: {
      search: () => new Promise<Profile[]>((resolve) => resolve([])),
      addNewPerson: ({ results, menuIndex }, action) => {
        if ('person' in action) {
          return new Promise<Profile>((resolve) => resolve(action.person));
        } else {
          return new Promise<Profile>((resolve) => resolve(results[menuIndex ?? 0]));
        }
      },
    },
  }
);

export default PersonPickerMachine;
