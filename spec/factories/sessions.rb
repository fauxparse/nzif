FactoryBot.define do
  factory :session do
    festival
    starts_at { '2023-10-09 10:00:00' }
    ends_at { '2023-10-09 13:00:00' }
    venue
    activity_type { Workshop }

    trait :with_workshop do
      activity { create(:workshop, festival:) }
    end
  end
end
