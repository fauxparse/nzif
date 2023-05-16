module Mutations
  module Profiles
    class Merge < BaseMutation
      graphql_name 'MergeProfiles'

      field :profile, Types::PersonType, null: false

      argument :attributes, Types::ProfileMergeAttributes, required: true
      argument :profile_ids, [ID], required: true

      def resolve(profile_ids:, attributes:)
        perform(
          ::Profiles::Merge,
          profiles: Profile.find(profile_ids),
          attributes: attributes.to_h,
        )
      end
    end
  end
end
