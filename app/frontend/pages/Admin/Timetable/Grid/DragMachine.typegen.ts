// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(0)#drag.clicked': { type: 'xstate.after(0)#drag.clicked' };
    'xstate.after(0)#drag.dropped': { type: 'xstate.after(0)#drag.dropped' };
    'xstate.after(700)#drag.pointerDown': { type: 'xstate.after(700)#drag.pointerDown' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    clear:
      | 'POINTER_UP'
      | 'xstate.after(0)#drag.clicked'
      | 'xstate.after(0)#drag.dropped'
      | 'xstate.init';
    setOrigin: 'POINTER_DOWN';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isMouseEvent: 'POINTER_MOVE';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'clicked'
    | 'dropped'
    | 'idle'
    | 'lifted'
    | 'lifted.dragging'
    | 'lifted.idle'
    | 'pointerDown'
    | { lifted?: 'dragging' | 'idle' };
  tags: never;
}
