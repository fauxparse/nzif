import { createContext, useContext } from 'react';
import { assign, createMachine, InterpreterFrom } from 'xstate';

type Events =
  | { type: 'EDIT' }
  | {
      type: 'CONFIRM';
      value: string;
    }
  | { type: 'CANCEL' };

type Context = {
  value: string;
};

type Services = {
  confirm: { data: string };
};

const InPlaceEditMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEsB2AFANgQwMZgFEJkAXAOmQkzAGICARASQBUB9AYQBlH2BpBgNoAGALqJQABwD2sUsimpxIAB6IAtAEYAHABYyGgKw6AzADYAnMaMAmHVqEGANCACe647bJWh1+wHZTDT9tPwMAXzDnNCw8QmJySDlUKDoAZXYAQXQCVnQAJQJU1MFRJWlZEnlFJBV1IKEyc0sDAwsA420zZzcENS1rL1M-Ww8-Ex1zA2MIqIwcfCJSMkTK5LoAOWYCPNyCopKxGvK5BSVVBFtTMh0NIQ1rAz8PHWttLW66oMahE2tXjr8wRuMxA0XmcSWuAUADNkAAnAC2aBSEAUYAoqAAblIANbosGxRbkKGoWGI5EINDY3DYSoKYQiBllGQnaqgc5qUwDcxPLQBSYdB4fBDGPxkHx3Pw8uxTAyGUwggkLeJkElkpFrMBwuFSOFkCQ4EjQ3UIjExZWQmHwjVQSlYqQ0umoBlMo4sp1nRAaF7XOWhepacy6YzvVxekxkUyinQOYyTAxCPxaCKRECoKQQOBKJUQkjMipVT29DwGRoeSa+exaAzmHTCtQ3BpaONaLn9Yx2KOKuaElWUaj51lFtTWQFl6wVrRVmt1sO9bQNONxn4aZpx7vm3PLeLIwcemrnIbXCZvazPV5T+t-AZ8kzDWtWdepnNE1VW8nJPeFg+IayBfStJMq4-BOFjCvc4pnne4QpkAA */
    id: 'inPlaceEdit',
    tsTypes: {} as import('./InPlaceEditMachine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
    },
    predictableActionArguments: true,

    states: {
      idle: {
        on: {
          EDIT: 'editing',
        },
      },

      editing: {
        on: {
          CANCEL: {
            target: 'idle',
            actions: 'resetValue',
          },
          CONFIRM: 'confirming',
        },
      },

      confirming: {
        invoke: {
          src: 'confirm',
          onDone: {
            target: 'idle',
            actions: 'storeNewValue',
          },
          onError: 'editing',
        },
      },
    },

    initial: 'idle',
  },
  {
    actions: {
      storeNewValue: assign({
        value: (_, event) => event.data,
      }),
    },
  }
);

export default InPlaceEditMachine;

export const Context = createContext({} as { machine: InterpreterFrom<typeof InPlaceEditMachine> });

export const useInPlaceEdit = () => useContext(Context);
