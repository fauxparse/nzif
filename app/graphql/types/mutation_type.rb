# rubocop:disable GraphQL/FieldDescription
module Types
  class MutationType < Types::BaseObject
    description 'Top-level mutation interface'

    field :update_preference, mutation: Mutations::UpdatePreference
  end
end
# rubocop:enable GraphQL/FieldDescription
