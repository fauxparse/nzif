module Mutations
  module Registrations
    class Finalise < BaseMutation
      graphql_name 'finaliseRegistration'

      field :registration, Types::RegistrationType, null: false

      def resolve
        perform(::Registrations::Finalise, registration: current_registration)
      end
    end
  end
end
