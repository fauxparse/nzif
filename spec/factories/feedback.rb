FactoryBot.define do
  factory :feedback do
    session factory: %i[session with_worshop]
    registration { create(:registration, :with_user, festival: session.festival) } # rubocop:disable FactoryBot/FactoryAssociationWithStrategy
    rating { 3 }
    positive { 'This was great' }
    constructive { 'This was not great' }
    testimonial { 'They were great' }
  end
end
