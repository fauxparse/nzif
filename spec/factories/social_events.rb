FactoryBot.define do
  factory :social_event do
    festival
    sequence(:name) { |n| "Social event #{n}" }

    trait :with_organiser do
      after(:build) do |record|
        record.cast << build(:organiser, activity: record)
      end
    end
  end
end
