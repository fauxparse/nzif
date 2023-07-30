FactoryBot.define do
  factory :placement do
    session
    registration { create(:registration, festival: session.festival) }
  end
end
