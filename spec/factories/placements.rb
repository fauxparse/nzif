FactoryBot.define do
  factory :placement do
    session
    registration { association :registration, festival: session.festival }
  end
end
