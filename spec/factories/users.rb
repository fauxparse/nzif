FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }

    name { 'Lauren Ipsum' }
    password { 'P4$$w0rd' }
  end
end
