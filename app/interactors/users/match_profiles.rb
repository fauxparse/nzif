module Users
  class MatchProfiles < ApplicationInteractor
    delegate :user, to: :context

    def call
      authorize! User.new, to: :update?

      context[:possible_matches] ||= find_possible_matches
    end

    private

    def find_possible_matches
      Profile
        .without_attached_user
        .joins(
          <<~SQL.squish,
            INNER JOIN users
            ON users.searchable @@ (to_tsquery('english', ''' ' || unaccent (profiles.name) || ' ''' || ':*'))
          SQL
        )
        .select('profiles.*, users.id AS user_id')
    end
  end
end
