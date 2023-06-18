module Mutations
  module Registrations
    class UpdateUserDetails < BaseMutation
      field :registration, Types::RegistrationType, null: false

      argument :attributes, Types::UserDetailsAttributes, required: true
      argument :registration_id, GraphQL::Types::ID, required: false

      def resolve(attributes:, registration_id: nil)
        registration = find_registration(id: registration_id) ||
                       current_user.registrations.create!(festival: current_festival)
        perform(::Registrations::UpdateUserDetails, registration:, attributes:)
      end
    end
  end
end
