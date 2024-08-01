FactoryBot.define do
  factory :session do
    transient do
      date { festival.start_date }
    end

    festival
    starts_at { date.to_time + 10.hours }
    ends_at { starts_at + 3.hours }
    venue
    activity_type { Workshop }
    capacity { 5 }

    trait :morning

    trait :afternoon do
      starts_at { date.to_time + 13.hours }
    end

    trait :full_day do
      ends_at { starts_at + 7.hours }
    end

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
