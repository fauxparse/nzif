// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(300)#grid.pointerDown': { type: 'xstate.after(300)#grid.pointerDown' };
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
    clearSelection: 'CLEAR_SELECTION' | 'POINTER_DOWN' | 'POINTER_UP';
    clearSelectionOrigin: 'POINTER_UP';
    setSelection: 'POINTER_MOVE' | 'POINTER_UP' | 'SET_SELECTION';
    setSelectionOrigin: 'POINTER_DOWN';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: 'idle' | 'pointerDown' | 'selecting';
  tags: never;
}
