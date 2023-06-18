FactoryBot.define do
  factory :registration do
    user { nil }

    trait :with_user do
      user { create(:user, :with_profile) }
    end
  end
end
