FactoryBot.define do
  factory :workshop do
    festival
    sequence(:name) { |n| "Workshop #{n}" }

    trait :with_tutor do
      after(:build) do |record|
        record.cast << build(:tutor, activity: record)
      end
    end
  end
end
