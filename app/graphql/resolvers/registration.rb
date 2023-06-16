module Resolvers
  class Registration < BaseResolver
    type Types::RegistrationType, null: false

    argument :year, ID, required: false

    def resolve(year: nil)
      (current_user&.registrations || ::Registration)
        .includes(user: :profile, preferences: { session: :activity })
        .find_or_initialize_by(festival: festival(year:))
    end

    private

    def festival(year: nil)
      if year
        ::Festival.by_year(year).first!
      else
        ::Festival.where('end_date >= ?', Time.zone.today).first || Festival.last
      end
    end
  end
end
