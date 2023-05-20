FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }

    name { 'Lauren Ipsum' }
    password { 'P4$$w0rd' }

    factory :admin do
      permissions { [:admin] }
    end
  end
end
