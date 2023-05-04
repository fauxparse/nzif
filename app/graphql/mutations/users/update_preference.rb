module Mutations
  module Users
    class UpdatePreference < Mutations::BaseMutation
      description 'Updates a user’s preference'

      field :preference, Types::PreferenceType, null: false,
        description: 'The updated preference'

      argument :id, String, required: true, description: 'The ID of the preference to update'
      argument :value, Types::PreferenceValue, required: true,
        description: 'The new value for the preference as a boolean'

      def resolve(id:, value:)
        preference = User.preferences[id.underscore.to_sym]

        result = perform(
          ::Users::UpdatePreference,
          user: current_user,
          id: preference.name,
          value: value[preference.type],
        )
        raise GraphQL::ExecutionError, 'Could not update the preference' unless result.success?

        preference.to_graphql_object_for(current_user)
      end
    end
  end
end