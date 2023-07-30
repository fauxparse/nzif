FactoryBot.define do
  factory :registration do
    user { create(:user, :with_profile) }
    festival

    trait :code_of_conduct_accepted do
      code_of_conduct_accepted_at { Time.zone.now }
    end
  end
end
