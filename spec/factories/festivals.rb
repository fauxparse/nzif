FactoryBot.define do
  factory :festival do
    start_date { Date.new(2025, 9, 26) }
    end_date { start_date + 1.week }
    earlybird_opens_at { start_date - 2.months }
    earlybird_closes_at { earlybird_opens_at + 1.month }
    general_opens_at { earlybird_closes_at + 1.week }

    trait :with_workshops do
      transient do
        workshop_days { 1 }
      end

      after(:create) do |festival, evaluator|
        evaluator.workshop_days.times do |i|
          create_list(
            :session,
            3,
            :with_workshop,
            festival:,
            starts_at: festival.start_date.to_time + i.days + 10.hours,
          )
        end
      end
    end

    trait :with_registrations do
      transient do
        registrations_count { 20 }
      end

      after(:create) do |festival, evaluator|
        create_list(
          :registration,
          evaluator.registrations_count,
          :completed,
          :with_preferences,
          festival:,
        )
      end
    end

    trait :with_confirmed_registrations do
      transient do
        registrations_count { 20 }
      end

      after(:create) do |festival, evaluator|
        create_list(
          :registration,
          evaluator.registrations_count,
          :completed,
          :with_placements,
          festival:,
        )
      end
    end
  end
end
