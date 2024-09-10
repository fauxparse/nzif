module Resolvers
  class Registration < BaseResolver
    type Types::RegistrationType, null: false

    argument :id, ID, required: false

    def resolve(id: nil)
      user = id ? Profile.includes(:user).find(id)&.user : current_user

      (user&.registrations || ::Registration)
        .includes(user: :profile, preferences: { session: :activity })
        .find_or_initialize_by(festival: current_festival, user:)
        .tap { |registration| authorize! registration, to: :view? }
    end

    private

    def festival(year: nil)
      if year
        ::Festival.by_year(year).first!
      else
        ::Festival.where(end_date: Time.zone.today..).first || Festival.last
      end
    end
  end
end
