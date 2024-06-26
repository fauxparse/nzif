module Mutations
  module Profile
    class Update < BaseMutation
      graphql_name 'UpdateProfile'

      payload_type Types::PersonType

      argument :attributes, Types::ProfileAttributes, required: true

      def resolve(attributes:)
        profile = context[:current_user].profile
        profile_attributes = attributes.to_h.except(:email)

        unless profile_attributes.empty?
          perform(::Profiles::Update, profile:, attributes: profile_attributes)
        end

        context[:current_user].update!(email: attributes[:email]) if attributes[:email].present?

        profile
      end
    end
  end
end
