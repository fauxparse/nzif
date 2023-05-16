module Mutations
  module Profiles
    class Merge < BaseMutation
      graphql_name 'MergeProfiles'
      description 'Merge multiple profiles into one'

      field :profile, Types::PersonType, null: false, description: 'The merged profile'

      argument :attributes, Types::ProfileMergeAttributes, required: true,
        description: 'Hash of attribute names and IDs to select the values from'
      argument :profile_ids, [ID], required: true, description: 'IDs of the profiles to merge'

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
