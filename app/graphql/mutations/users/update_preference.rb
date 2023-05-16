module Mutations
  module Users
    class UpdatePreference < Mutations::BaseMutation
      field :preference, Types::PreferenceType, null: false

      argument :id, String, required: true
      argument :value, Types::PreferenceValue, required: true

      def resolve(id:, value:)
        preference = User.preferences[id.underscore.to_sym]

        result = perform(
          ::Users::UpdatePreference,
          user: current_user,
          id: preference.name,
          value: value[preference.type],
        )
        raise GraphQL::ExecutionError, 'Could not update the preference' unless result.success?

        { preference: preference.to_graphql_object_for(current_user) }
      end
    end
  end
end
