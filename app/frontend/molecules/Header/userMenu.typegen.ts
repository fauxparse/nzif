// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    logIn: 'done.invoke.user.open.loggingIn:invocation[0]';
    signUp: 'done.invoke.user.open.signingUp:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: 'loggedIn';
    services: 'logIn' | 'signUp';
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    loggedIn: 'TOGGLE';
  };
  eventsCausingServices: {
    logIn: 'LOG_IN';
    signUp: 'SIGN_UP';
  };
  matchesStates:
    | 'closed'
    | 'open'
    | 'open.checkInbox'
    | 'open.forgot'
    | 'open.logIn'
    | 'open.loggedIn'
    | 'open.loggingIn'
    | 'open.signUp'
    | 'open.signingUp'
    | {
        open?:
          | 'checkInbox'
          | 'forgot'
          | 'logIn'
          | 'loggedIn'
          | 'loggingIn'
          | 'signUp'
          | 'signingUp';
      };
  tags: never;
}
