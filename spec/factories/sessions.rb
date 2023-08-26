FactoryBot.define do
  factory :session do
    festival
    starts_at { Time.zone.parse('2023-10-09 10:00:00') }
    ends_at { starts_at + 3.hours }
    venue
    activity_type { Workshop }
    capacity { 5 }

    trait :with_workshop do
      activity { create(:workshop, festival:) }
    end
  end
end
