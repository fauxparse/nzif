import { graphql } from '@/graphql';

export const YourselfQuery = graphql(`
  query Yourself {
    user {
      id
      email

      profile {
        id
        name
        pronouns
        phone

        city {
          id
          name
          traditionalNames
          country
        }
      }
    }
  }
`);

export const AcceptCodeOfConductMutation = graphql(`
  mutation AcceptCodeOfConduct($codeOfConductAcceptedAt: ISO8601DateTime!, $photoPermission: Boolean!) {
    updateRegistrationUserDetails(attributes: { codeOfConductAcceptedAt: $codeOfConductAcceptedAt, photoPermission: $photoPermission }) {
      registration {
        id
        codeOfConductAcceptedAt
        photoPermission
      }
    }
  }
`);

export const HideExplainerMutation = graphql(`
  mutation HideExplainer {
    updateRegistrationUserDetails(attributes: { showExplainer: false }) {
      registration {
        id
        showExplainer
      }
    }
  }
`);

export const FinaliseRegistrationMutation = graphql(`
  mutation FinaliseRegistration {
    finaliseRegistration {
      registration {
        id
        completedAt
      }
    }
  }
`);

export const PaymentIntentQuery = graphql(`
  query PaymentIntent($amount: Money!) {
    registration {
      id
      paymentIntent(amount: $amount) {
        clientSecret
        error
      }
    }
  }
`);

export const UpdateRegistrationMutation = graphql(`
  mutation UpdateRegistration($attributes: RegistrationAttributes!) {
    updateRegistration(attributes: $attributes) {
      registration {
        id
        codeOfConductAcceptedAt
        photoPermission
        donateDiscount
      }
    }
  }
`);
