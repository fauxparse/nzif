import { createContext } from 'react';
import { assign, createMachine, InterpreterFrom } from 'xstate';

export type LogInAction = { type: 'LOG_IN'; email: string; password: string };
export type LogOutAction = { type: 'LOG_OUT' };
export type SignUpAction = { type: 'SIGN_UP'; name: string; email: string; password: string };
export type ResetPasswordAction = { type: 'RESET_PASSWORD'; email: string };
type NavigationAction = {
  type: 'TOGGLE' | 'LOG_IN_CLICKED' | 'SIGN_UP_CLICKED' | 'FORGOT_CLICKED';
};

type Action = LogInAction | LogOutAction | SignUpAction | ResetPasswordAction | NavigationAction;

export type User = {
  id: string;
  name: string;
  email?: string;
};

export type Context = {
  user: User | null;
  error: string | null;
  loading: boolean;
};

type Services = {
  logIn: { data: { user: User } };
  signUp: { data: { user: User } };
  logOut: { data: boolean };
  resetPassword: { data: boolean };
};

const AuthenticationMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFmAduglgMbIED2OAdADalQwQCSOAxADIDyA4gPrsCqAFQDaABgC6iUAAdSsfGRySQAD0QBGEQDYAnBR0BWAEwAONduOGALIbMAaEAE9EhkYYrHNAdjUfDJywDM1poAviH2aFi4BMQK1LRMbFzcDAByohJIIDJyCkqqCIaaanpq+saeRpaWapZa9k4IngGaFPpGIp5aap5e5WERGNh4RCT45PFQiQDKDJyp3HwACtwAwqwMqwDSAKIAIhlKOfLjilkFRSXF5ZVWNXWaDYiW2pYUajYiHh9aIvqWngGIEiwxiYwmNCmLAAYuwAEqcdgCNYbbb7Q5ZY55c7OYqlG5Ve71RyIYzGALvQI2fQ9V6BSxAkHRUZxSFQfA4KHMCDkMAUDkAN1IAGs+UyRrFTpN2ZymAhBaRJeQMhjpLITuR8ohNNU2gFDPoAj0AhZTIYnghNPqKJUvv8XjYKvpGUNmUrKGyOVywAAnH2kH0UKRUEgAMwDAFsKOKwazaDKofKcEL3SrxEd1djQAUAiI3p5tK9NMZC0THiTLWpWuTPH5i14+sYXVEJeDKHIoDg+FJmLN5oslqrspnTlqEAEJ+8tL19J4AZ0RAELfqRBRtGUWhO1D0G83QSypR2uz2ODw0ijNrsDunMSPNTjCt4bUV9JoDcun3UXpZDc1DTTQnCYFXVbOIjy9btuV5flkxFMUQNjQ98E7CCpCTFM2zTTI1VyUcH0ufEnTuWpiUaUwKEsYxX0qUwdxovc3TbChwM5SDfX9QNgzDSNowQg8JhYqBu3QxVMPEIcsTw7NcSuMoiOqEjy0aFwShcP4zFfOj+iAmN+MocMfSgUh0CWZBYFgAB3AMIGYOEdmmHZkSWABBaZpgAdXha9sOHXD72ky1dUNA0jWaU0PgtMk3lqA0S1fbQRHXJsdL490KAMoyTLMyzrKSM8FnWS90RvHCNTOALDCfWtNFfd8K08CoKDzKsjC8OkggY0CpR9OAwHQAhOSgnA+QVUVeJbRCJh62A+oGqARNTcSSt8sqxw0HQ9G0IxTHMKwbG0SKtDXdptH1YpvCdTrJsoabZq9Zh2IDIMQ3QAyo10tLbv6r0FrEsQJLvcqVG1AEmvKWdjBeD4NAO+r1ya6xKtNbQCxeK69OlL12AwIaRtgsaPqYz1OWx9BfoULCMz8oGClqQIKEMFpTshmc330C1CyamqUZEDRDFefQUfRtLiagUmHr9J6uNenjCbjOgsYwcnTkp29qbW7d9AomcjV26w7Arcl3iMIIrAa+kDTCICcFICA4CUOWpJWrNgYQABaJTEA94WifjSAmCp1aHxLVpC1cbdKOLKtLAtD4KUhmqugnfx9C0H35YDtWg4Cj5Q4BBKdVeRTzQrfWKM6Fpt00KOGvTqVRcz0qXYKAE3Daxmw7Jf4S8aHU3haZpTpeFoTbrgTkOPQPm+eDaUaMVPiIeZcrAZnV9TKWlqgCMf2wn1Cp6dlue-UMpnxfNmd-SgNMtM8yrJ9CAD-813LFn24F4UpfDZ8Cj+Y7hKu41Evl9OaT8aaklfnoYwiUdCM3CsfBA0CtYvh6B4aBNRCyX2GsodA0x0BgCkPALO08EAfC6HoE2ah9T6n1rDMiJgbTFEqn8RmnQqGX1FqTMBa1mEUMZlQxme0DaNG3KuYsBpEoaAUl8NQHC-YQC4cQw+6hBbGAomQsw1VarswrFQ6KDVNAiESvON8hgrYhCAA */
    tsTypes: {} as import('./AuthenticationMachine.typegen').Typegen0,
    predictableActionArguments: true,

    schema: {
      actions: {} as Action,
      context: {} as Context,
      services: {} as Services,
    },

    context: {
      user: null,
      error: null,
      loading: true,
    },

    initial: 'loading',
    id: 'authentication',

    states: {
      loading: {
        always: [
          {
            cond: 'loggedIn',
            target: 'loggedIn',
            actions: 'clearLoading',
          },
          {
            target: 'logIn',
            actions: 'clearLoading',
          },
        ],
      },

      loggedIn: {
        on: {
          LOG_OUT: {
            target: 'loggingOut',
            actions: 'setLoading',
          },
        },
      },

      logIn: {
        on: {
          LOG_IN: 'loggingIn',
          SIGN_UP_CLICKED: {
            target: 'signUp',
            actions: ['clearError', 'setLoading'],
          },
          FORGOT_CLICKED: {
            target: 'forgotPassword',
            actions: 'clearError',
          },
        },
      },

      loggingIn: {
        invoke: {
          src: 'logIn',

          onDone: {
            target: 'loggedIn',
            actions: ['setUser', 'clearLoading'],
          },

          onError: {
            target: 'logIn',
            actions: ['setError', 'clearLoading'],
          },
        },
      },

      signUp: {
        on: {
          SIGN_UP: 'signingUp',
          LOG_IN_CLICKED: {
            target: 'logIn',
            actions: ['clearError', 'setLoading'],
          },
        },
      },

      signingUp: {
        invoke: {
          src: 'signUp',

          onDone: {
            target: 'loggedIn',
            actions: ['setUser', 'clearLoading'],
          },

          onError: {
            target: 'signUp',
            actions: ['setError', 'clearLoading'],
          },
        },
      },

      forgotPassword: {
        on: {
          RESET_PASSWORD: {
            target: 'resetting',
            actions: 'setLoading',
          },
          LOG_IN_CLICKED: {
            target: 'logIn',
            actions: 'clearError',
          },
        },
      },

      resetting: {
        invoke: {
          src: 'resetPassword',
          onDone: {
            target: 'nextSteps',
            actions: 'clearLoading',
          },
          onError: {
            target: 'forgotPassword',
            actions: 'setError',
          },
        },
      },

      nextSteps: {},
      loggingOut: {
        invoke: {
          src: 'logOut',

          onDone: {
            target: 'loggedOut',
            actions: ['clearUser', 'clearLoading'],
          },

          onError: {
            target: 'loggedIn',
            actions: ['setError', 'clearLoading'],
          },
        },
      },

      loggedOut: {},
    },
  },
  {
    actions: {
      setUser: assign({
        user: (_, event) => event.data.user,
      }),
      clearUser: assign({ user: null }),
      setError: assign({
        error: () => 'somethin’s fucky',
      }),
      clearError: assign({ error: null }),
      setLoading: assign({ loading: true }),
      clearLoading: assign({ loading: false }),
    },
    guards: {
      loggedIn: (context) => !!context.user,
    },
  }
);

export default AuthenticationMachine;

export const AuthenticationContext = createContext(
  {} as { machine: InterpreterFrom<typeof AuthenticationMachine> }
);
