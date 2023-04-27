// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(300)#drag.pointerDown': { type: 'xstate.after(300)#drag.pointerDown' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: 'isMouseEvent';
    services: never;
  };
  eventsCausingActions: {};
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
