// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.authentication.loggingIn:invocation[0]': {
      type: 'done.invoke.authentication.loggingIn:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.authentication.loggingOut:invocation[0]': {
      type: 'done.invoke.authentication.loggingOut:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.authentication.resetting:invocation[0]': {
      type: 'done.invoke.authentication.resetting:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.authentication.signingUp:invocation[0]': {
      type: 'done.invoke.authentication.signingUp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.authentication.loggingIn:invocation[0]': {
      type: 'error.platform.authentication.loggingIn:invocation[0]';
      data: unknown;
    };
    'error.platform.authentication.loggingOut:invocation[0]': {
      type: 'error.platform.authentication.loggingOut:invocation[0]';
      data: unknown;
    };
    'error.platform.authentication.resetting:invocation[0]': {
      type: 'error.platform.authentication.resetting:invocation[0]';
      data: unknown;
    };
    'error.platform.authentication.signingUp:invocation[0]': {
      type: 'error.platform.authentication.signingUp:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    logIn: 'done.invoke.authentication.loggingIn:invocation[0]';
    logOut: 'done.invoke.authentication.loggingOut:invocation[0]';
    resetPassword: 'done.invoke.authentication.resetting:invocation[0]';
    signUp: 'done.invoke.authentication.signingUp:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    clearError: 'FORGOT_CLICKED' | 'LOG_IN_CLICKED' | 'SIGN_UP_CLICKED';
    clearLoading:
      | 'done.invoke.authentication.loggingIn:invocation[0]'
      | 'done.invoke.authentication.loggingOut:invocation[0]'
      | 'done.invoke.authentication.resetting:invocation[0]'
      | 'done.invoke.authentication.signingUp:invocation[0]'
      | 'error.platform.authentication.loggingIn:invocation[0]'
      | 'error.platform.authentication.loggingOut:invocation[0]'
      | 'error.platform.authentication.signingUp:invocation[0]';
    clearUser: 'done.invoke.authentication.loggingOut:invocation[0]';
    setError:
      | 'error.platform.authentication.loggingIn:invocation[0]'
      | 'error.platform.authentication.loggingOut:invocation[0]'
      | 'error.platform.authentication.resetting:invocation[0]'
      | 'error.platform.authentication.signingUp:invocation[0]';
    setLoading: 'LOG_IN_CLICKED' | 'LOG_OUT' | 'RESET_PASSWORD' | 'SIGN_UP_CLICKED';
    setUser:
      | 'done.invoke.authentication.loggingIn:invocation[0]'
      | 'done.invoke.authentication.signingUp:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    logIn: 'LOG_IN';
    logOut: 'LOG_OUT';
    resetPassword: 'RESET_PASSWORD';
    signUp: 'SIGN_UP';
  };
  matchesStates:
    | 'forgotPassword'
    | 'logIn'
    | 'loggedIn'
    | 'loggedOut'
    | 'loggingIn'
    | 'loggingOut'
    | 'nextSteps'
    | 'resetting'
    | 'signUp'
    | 'signingUp';
  tags: never;
}
