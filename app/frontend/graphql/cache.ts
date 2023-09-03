import { InMemoryCache } from '@apollo/client';

import { scalarTypePolicies } from './types';

const cache = () =>
  new InMemoryCache({
    possibleTypes: {
      Activity: ['Show', 'Workshop', 'SocialEvent'],
      Payment: ['CreditCardPayment', 'InternetBankingPayment', 'Voucher'],
      Setting: ['BooleanSetting', 'StringSetting'],
      SearchResult: ['ActivityResult', 'PersonResult', 'VenueResult', 'PageResult'],
    },
    typePolicies: {
      ...scalarTypePolicies,
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
    },
  });

export default cache;
