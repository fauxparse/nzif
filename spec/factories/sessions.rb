FactoryBot.define do
  factory :session do
    festival
    starts_at { Time.zone.parse('2023-10-09 10:00:00') }
    ends_at { starts_at + 3.hours }
    venue
    activity_type { Workshop }
    capacity { 5 }

    trait :with_workshop do
      activity { association :workshop, :with_tutor, festival: }
    end

    trait :with_show do
      activity_type { Show }
      activity { association :show, :with_director, festival: }
    end

    trait :with_participants do
      transient do
        participants_count { 5 }
      end

      after(:create) do |session, evaluator|
        create_list(
          :registration,
          evaluator.participants_count,
          festival: session.festival,
        ).each do |registration|
          session.placements.create!(registration:)
        end
      end
    end
  end
end
