module Mutations
  module Registrations
    class UpdatePreferences < BaseMutation
      graphql_name 'updatePreferences'

      field :registration, Types::RegistrationType, null: false

      argument :preferences, [Types::PreferenceAttributes], required: true

      def resolve(preferences:)
        perform(
          ::Registrations::SaveWorkshopPreferences,
          registration: current_registration,
          preferences:,
        )
      end
    end
  end
end
