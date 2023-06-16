import { assign, createMachine } from 'xstate';

import { TimetableSessionFragment } from '@/graphql/types';
import { Cell } from '@/molecules/Grid/Grid.types';

import { Block } from './useTimetable';

type PointerType = PointerEvent['pointerType'];
type Session = TimetableSessionFragment;

type Context = {
  element: HTMLElement | null;
  block: Block<Session> | null;
  origin: Cell;
  pointerType: PointerType | null;
};

type PointerDownEvent = {
  type: 'POINTER_DOWN';
  block: Block<Session>;
  element: HTMLElement;
  origin: Cell;
  pointerType: PointerType;
};

type PointerMoveEvent = {
  type: 'POINTER_MOVE';
};

type PointerUpEvent = {
  type: 'POINTER_UP';
};

type Event = PointerDownEvent | PointerMoveEvent | PointerUpEvent;

const DragMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQE4EMoDoCWEA2YAxAAoDyAkgHIAqAogEoD6AIqQOqUDaADALqKgADgHtY2AC7ZhAOwEgAHogCMANgCsmdQA4ta1QCYAzGuOqANCACeiAJwAWDUoDs+tSpv6ndm9yMBfPwtUDEwRbGlxMBRmYQB3aRIKGgZGAFlSADVaHn4kEBExSRk5RQQVfQtrBBsbDRVypT1DQ3r3GwCg9CwwiKiY+MSqOiYAVWIcuQKJKVk80rUKq2U7JxtMQyVvTzslH316jpBg7uFwyOi4hPlYcTRIzDQAM3OACkNubgBKQmPQ096LvEJnkpkVZqB5osqiY7Jg7HZuJsnIYantDIdfnhsM9IDh8EQyEMUmNgUJRNNinNEO8VJgtLVdFonCo7CytPDKso1Nw4U4lIZmTsfCpkVoMV1MFicRBMMcoOEoINkkx0llSflyWCSohmTz6RsdCt1OU1JyEK5HGodDZkajfIY7OKQlLIjK5QqlcNGCS+JNNTNtQgaXSGVbBWyOUtzU4eXyVKovN5akp9E6sABjLHpgDWkEI6tBAapCFUdStugMxlMKjNWlcmA87P0WhZNXtadlKGEgkEeYL-spEMQaicTkw3KcddHYfpSjNnn0mH0qi0zl0VodNhUAUCIGkwggcDkxz9hSLQ4QAFoVnCN839CtuDGNvOlJp3EYnGoHFt9P5d78uAEKeFLggoiA8t+CbOAsHhbkyppRqssJNM2jTcHYGwbB2PTnP0YGFoO4FBt46zMs2NgtMyX5aGaNSGO+y5NC09Q1B2LqQCBWrFnyi76kohrMm4rhmko3BrKocHcBs6grKy7HYq6eLASCA5gaUWjcLSeiSfoGF8rsc5RrstKsfsI6Ps+CnSp2GDytIUBceexGTlodL8imbhidWZobDyEbIfGrHtABEqZtgOacapZ5EaUeljg63KsjUMbPqJLRuY0zjNCi7ICmoHaoN2vYQE5sWIKyi4PuJ3AjvGfIIfOfJLqoCbwjUeipjuQA */
    tsTypes: {} as import('./DragMachine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Event,
    },
    predictableActionArguments: true,

    context: {
      element: null,
      block: null,
      origin: { row: 0, column: 0 },
      pointerType: '',
    },

    id: 'drag',

    initial: 'idle',

    states: {
      idle: {
        on: {
          POINTER_DOWN: {
            target: 'pointerDown',
            actions: ['setOrigin'],
          },
        },

        entry: 'clear',
      },

      pointerDown: {
        on: {
          POINTER_MOVE: {
            target: 'lifted.dragging',
            cond: 'isMouseEvent',
          },
          POINTER_UP: '#drag.clicked',
        },
        after: {
          700: 'lifted.idle',
        },
      },

      lifted: {
        states: {
          idle: {
            on: {
              POINTER_UP: '#drag.idle',
              POINTER_MOVE: {
                target: 'dragging',
                internal: true,
              },
            },
          },
          dragging: {
            on: {
              POINTER_UP: '#drag.dropped',
            },
          },
        },

        initial: 'idle',
      },

      clicked: {
        after: {
          0: 'idle',
        },
      },

      dropped: {
        after: {
          0: 'idle',
        },
      },
    },
  },
  {
    actions: {
      setOrigin: assign((_, { origin, pointerType, element, block }) => ({
        origin,
        pointerType,
        element,
        block,
      })),
      clear: assign({ element: null, block: null }),
    },
    guards: {
      isMouseEvent: ({ pointerType }) => pointerType === 'mouse',
    },
  }
);

export default DragMachine;
