FactoryBot.define do
  factory :waitlist do
    session
    registration { create(:registration, festival: session.festival) } # rubocop:disable FactoryBot/FactoryAssociationWithStrategy
  end
end
