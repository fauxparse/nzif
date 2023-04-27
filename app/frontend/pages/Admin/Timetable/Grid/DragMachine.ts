import { assign, createMachine } from 'xstate';

type Position = { x: number; y: number };

type PointerType = PointerEvent['pointerType'];

type Context = {
  element: HTMLElement | null;
  offset: Position;
  position: Position;
  pointerType: PointerType | null;
};

type PointerDownEvent = {
  type: 'POINTER_DOWN';
  element: HTMLElement;
  position: Position;
  pointerType: PointerType;
};

type PointerMoveEvent = {
  type: 'POINTER_MOVE';
  position: Position;
};

type PointerUpEvent = {
  type: 'POINTER_UP';
  position: Position;
};

type Event = PointerDownEvent | PointerMoveEvent | PointerUpEvent;

const DragMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQE4EMoDoCWEA2YAxAAoDyAkgHIAqAogEoD6AIqQOqUDaADALqKgADgHtY2AC7ZhAOwEgAHogCMANgCsmdQA4ta1QCYAzGuOqANCACeiAJwAWDUoDs+tSpv6ndm9yMBfPwtUDEwRbGlxMBRmYQB3aRIKGgZGAFlSADVaHn4kEBExSRk5RQQVfQtrBBsbDRVypT1DQ3r3GwCg9CwwiKiY+MSqOiYAVWIcuQKJKVk80rUKq2U7JxtMQyVvTzslH316jpBg7uFwyOi4hPlYcTRIzDQAM3OACkNubgBKQmPQ096LvEJnkpkVZqB5osqiY7Jg7HZuJsnIYantDIdfnhsM9IDh8EQyEMUmNgUJRNNinNEO8VJgtLVdFonCo7CytPDKso1Nw4U4lIZmTsfCpkVoMV1MFicRBMMcoOEoINkkx0llSflyWCSohmTz6RsdCt1OU1JyEK5HGodDZkajfIY7OKQlLIjK5QqlcNGCS+JNNTNtQgaXSGVbBWyOUtzU4eXyVKovN5akp9E6sABjLHpgDWkEI6tBAapCFUdStugMxlMKjNWlcmA87P0WhZNXtadlKGEgkEeYL-spEMQaicTkw3KcddHYfpSjNnn0mH0qi0zl0VodNhUAUCIGkwggcDkxz9hSLQ4QAFoVnCN839CtuDGNvOlJobVuBZs1DV4x3cAQp4UuCCiIDyag7CKzgLB4W5MqaUarLCTTNo03B2BsGwdj05z9CBhaDqBQbeOszLNjYLTMk4VpmjUhiaA0TQtPUNQdi6kBAVqxZ8ou+pKIazJuK4ZpKNwaz8S0KILColG7Gx2KunigEggOIGlFo3C0noqgeOhfK7HOUa7LSLH7COj7PvJ0qdhg8rSFAnHnkRk5aHS-Ipm4onVmaGw8hGSHxix7S7r8mbYDmHEqWehGlPoT7rA46FtDGz4iS0rmNM4zQouyApqB2qDdr2ECOTFiCsouD5idwI7xny8HznyS6qAm8I1HoqY7kAA */
    tsTypes: {} as import('./DragMachine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Event,
    },
    predictableActionArguments: true,

    context: {
      element: null,
      offset: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      pointerType: '',
    },

    id: 'drag',

    initial: 'idle',

    states: {
      idle: {
        on: {
          POINTER_DOWN: 'pointerDown',
        },
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
          300: 'lifted.idle',
        },
      },

      lifted: {
        states: {
          idle: {
            on: {
              POINTER_UP: '#drag.idle',
            },
          },
          dragging: {
            on: {
              POINTER_MOVE: {
                target: 'dragging',
                internal: true,
              },

              POINTER_UP: '#drag.dropped',
            },
          },
        },

        initial: 'idle',
      },

      clicked: {
        always: 'idle',
      },

      dropped: {
        always: 'idle',
      },
    },
  },
  {}
);

export default DragMachine;
