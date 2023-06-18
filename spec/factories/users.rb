FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }

    name { 'Lauren Ipsum' }
    password { 'P4$$w0rd' }

    trait :with_profile do
      profile { create(:profile, name:) }
    end

    factory :admin do
      permissions { [:admin] }
    end
  end
end
