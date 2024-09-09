import { graphql } from '@/graphql';

export const CreateDonationMutation = graphql(`
  mutation CreateDonation($name: String!, $email: String!, $amount: Int!, $message: String, $anonymous: Boolean, $newsletter: Boolean) {
    createDonation(name: $name, email: $email, amountCents: $amount, message: $message, anonymous: $anonymous, newsletter: $newsletter) {
      donation {
        id
      }
    }
  }
`);

export const CreateDonationPayment = graphql(`
  mutation CreateDonationPayment($id: ID!) {
    createDonationPayment(id: $id) {
      donation {
        id
      }

      paymentIntentSecret
    }
  }
`);
