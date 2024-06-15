import { InMemoryCache, TypePolicies } from '@apollo/client';
import { merge } from 'lodash-es';

import { scalarTypePolicies } from './types';

const cache = () =>
  new InMemoryCache({
    possibleTypes: {
      Activity: ['Show', 'Workshop', 'SocialEvent', 'Conference'],
      Payment: ['CreditCardPayment', 'InternetBankingPayment', 'Voucher', 'Refund'],
      Setting: ['BooleanSetting', 'StringSetting'],
      SearchResult: ['ActivityResult', 'PersonResult', 'VenueResult', 'PageResult'],
    },
    typePolicies: merge({}, scalarTypePolicies, {
      Activity: {
        fields: {
          presenters: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      Query: {
        fields: {
          people: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      ActivityPicture: {
        merge: true,
      },
      Session: {
        fields: {
          participants: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      WorkshopAllocationSession: {
        fields: {
          registrations: {
            merge: (_, incoming) => incoming,
          },
          waitlist: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      Registration: {
        fields: {
          feedback: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      Show: {
        fields: {
          directors: {
            merge: (_, incoming) => incoming,
          },
        },
      },
      Workshop: {
        fields: {
          tutors: {
            merge: (_, incoming) => incoming,
          },
        },
      },
    } satisfies TypePolicies),
  });

export default cache;
