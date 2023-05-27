module Mutations
  module Users
    class UpdateSetting < Mutations::BaseMutation
      field :setting, Types::SettingType, null: false

      argument :id, String, required: true
      argument :value, Types::SettingValue, required: true

      def resolve(id:, value:)
        setting = User.settings[id.underscore.to_sym]

        result = perform(
          ::Users::UpdateSetting,
          user: current_user,
          id: setting.name,
          value: value[setting.type],
        )
        raise GraphQL::ExecutionError, 'Could not update the setting' unless result.success?

        { setting: setting.to_graphql_object_for(current_user) }
      end
    end
  end
end
