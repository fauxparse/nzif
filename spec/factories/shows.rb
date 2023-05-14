FactoryBot.define do
  factory :show do
    festival
    sequence(:name) { |n| "Show #{n}" }

    trait :with_director do
      after(:build) do |record|
        record.cast << build(:director, activity: record)
      end
    end
  end
end
