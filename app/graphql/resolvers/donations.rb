module Resolvers
  class Donations < Resolvers::BaseResolver
    type [Types::DonationType], null: false

    def resolve
      Donation
        .approved
        .where('extract(year from created_at) = ?', current_festival.year)
        .order(created_at: :desc)
    end
  end
end
