module Mutations
  module Registrations
    class Update < Mutations::BaseMutation
      argument :attributes, Types::RegistrationAttributes, required: true

      field :registration, Types::RegistrationType, null: true

      def resolve(attributes:)
        perform(
          ::Registrations::Update,
          registration: current_registration,
          attributes:,
        )
      end
    end
  end
end
