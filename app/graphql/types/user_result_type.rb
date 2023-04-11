module Types
  class UserResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from a user'

    field :user, UserType, null: false, description: 'User'

    def id
      "user[#{user.to_param}]"
    end

    def title
      user.name
    end

    def url
      "/admin/users/#{user.to_param}"
    end

    delegate :user, to: :object
  end
end
