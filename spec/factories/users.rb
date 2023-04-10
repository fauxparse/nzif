FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }

    name { 'Lauren Ipsum' }
    password { 'P4$$w0rd' }

    trait :admin do
      after(:build) do |record|
        record.roles.build(name: 'admin')
      end
    end
  end
end
