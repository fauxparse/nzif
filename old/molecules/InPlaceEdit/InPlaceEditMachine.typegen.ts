// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.inPlaceEdit.confirming:invocation[0]': {
      type: 'done.invoke.inPlaceEdit.confirming:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    confirm: 'done.invoke.inPlaceEdit.confirming:invocation[0]';
  };
  missingImplementations: {
    actions: 'resetValue';
    delays: never;
    guards: never;
    services: 'confirm';
  };
  eventsCausingActions: {
    resetValue: 'CANCEL';
    storeNewValue: 'done.invoke.inPlaceEdit.confirming:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    confirm: 'CONFIRM';
  };
  matchesStates: 'confirming' | 'editing' | 'idle';
  tags: never;
}
