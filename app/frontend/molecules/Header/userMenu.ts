import { createMachine } from 'xstate';

type ToggleAction = { type: 'TOGGLE' };
type SignUpClickedAction = { type: 'SIGN_UP_CLICKED' };
type LogInClickedAction = { type: 'LOG_IN_CLICKED' };
type ForgotClickedAction = { type: 'FORGOT_CLICKED' };
type LogInAction = { type: 'LOG_IN'; email: string; password: string };
type SignUpAction = { type: 'SIGN_UP'; name: string; email: string; password: string };
type ResetAction = { type: 'RESET'; email: string };

type Action =
  | ToggleAction
  | SignUpClickedAction
  | LogInClickedAction
  | ForgotClickedAction
  | LogInAction
  | SignUpAction
  | ResetAction;

const userMenu = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4DoDGAbA9mhAMQAqA8gOKUAyAogNoAMAuoqAA6ECWALt-gB27EAA9EARgBsAJkwBmACzyJATglMArJqmqA7FL0AaEAE9E8pZn0AOJnr2rNM3YuUBfdydQYcBImRUtIwSbEggXLB8AsLh4ggSenJKKupaOvqGJuYIMjbymEyKNpqqUopM8noqep7eaFj4HGCCgdT0zGGcPPxCIvESNsnKahraugbGZog2EpjFOnqas4mGy3UgPo3NgpgEUACSrTRUAPoHAHKdIpHRfXGIUhKK8xUSElWDNnr22RZqmE0iVUTES+SYMlBig2W0wTRae3wUCg3EEh1aECEYEwqIAbvgANbY2Hw3b7FFoo4IPH4bAAQ16gk613Ct0Z-UkQwUIzS40yUxyHwKigkQM01Sk9nkEKkMIacJ2iORqPRxAw6HwWA4uAZADNNQBbTAkxXklVUmn0xnM1g3HoxDkIQxMQHSarLJKyGx-XI-TA-SFMIPyGzKFxy3ykpVHYgAZQOlAupwAqgAFU4AYRoBwzAGk6AARFndKLsh5O56vUEfPRfH4Cx76BS6LRSeTlEWaaFeTbyqNRKCCZMcYgnSjnJNZnP5ou21n2+6geKqGyqTDlVwuZ6JX7TBDiqTrmSKFyaSzyM-SCPbBEDocj+OJlOp4sRBexJeSFSaTB2cU2KRJXyd55B9WQXUqUVVGgxwJEhGxrwVW9uEHFVh2ITFBGxGkiWNPtFTvNCOGpQR8StGIbS6N9SwdctRWGVIxgySYfT0b5f2WNtQy3fJEP7FDBCItV0A1LUdV4fV0CNE1kNQtFhxIsiGQo1hXzZWjPwSb9fy0NjAKYYCPh9cU5C7SxBiSdR4L400kRjAAxcgACVKHIUhM2zPNCzU99HSeF43GrT4bG+XcckUbRf0cRQ9GUGUYoQnsZN2SSoHwXhiCcuhYzoUgfJoxcxEQfQ1zPWRtAvQzQL3Co9EKHRtFXewu10GyEVS9K4wTJM0w86dvLnEs7g-IqEBKwF2xkCrlhUIyavFQFFH8pgylUFQ3DalLNTSjKxwnPqvNnKj1MK+JZBebR7B+CLa2cH0Kh-EMV1UGRjwMuwZE8HtBHwCA4BELY7QKkb4gAWikH1wcQvBCEgIHhsdE8fScTAZCcTRQTWJ5oNlJL8JaeGy00h75iDXQpBKPI2wvH1EheGQVC0XkakS+pI1s9FCY00aYoKBwDIvDHyicBtcnyRaSjKCoqhqTalRgCAji507EAi4UybKSmAMsTQfRSeY2KupwXFUNx5Dls1KRGk6QZmOD-WgiKhlBNGXB9Ld-TdJR1B+EpuzZm9djvYdldthJBjXIpANipninkGRjIcTA4JPKQzx1lRcYDpCg4EojQ8dZ5DEKNHqhXCrZghvcdAKMoISKMYVuqOWOt4Avy1DC7pWKJwVBcCn7o+axax7qb3li3i8fZhFsAACzAbACSOAAjfB4iGonRvHurVxryoZpA+77EBBrlhBJYltUL73CAA */
  id: 'user',
  tsTypes: {} as import('./userMenu.typegen').Typegen0,
  schema: {
    actions: {} as Action,
  },
  predictableActionArguments: true,
  initial: 'closed',
  states: {
    closed: {
      on: {
        TOGGLE: [
          {
            target: 'open.loggedIn',
            cond: 'loggedIn',
          },
          'open.logIn',
        ],
      },
    },
    open: {
      on: {
        TOGGLE: 'closed',
      },

      states: {
        logIn: {
          on: {
            SIGN_UP_CLICKED: 'signUp',
            LOG_IN: 'loggingIn',
            FORGOT_CLICKED: 'forgot',
          },
        },

        loggedIn: {},

        loggingIn: {
          invoke: {
            src: 'logIn',
            onDone: '#user.closed',
            onError: 'logIn',
          },
        },

        signUp: {
          on: {
            LOG_IN_CLICKED: 'logIn',
            SIGN_UP: 'signingUp',
          },
        },

        signingUp: {
          invoke: {
            src: 'signUp',
            onDone: '#user.closed',
            onError: 'signUp',
          },
        },

        forgot: {
          on: {
            RESET: 'checkInbox',
            SIGN_UP_CLICKED: 'signUp',
            LOG_IN_CLICKED: 'logIn',
          },
        },

        checkInbox: {},
      },

      initial: 'logIn',
    },
  },
});

export default userMenu;
