FactoryBot.define do
  factory :festival do
    start_date { Date.new(2023, 10, 7) }
    end_date { start_date + 1.week }

    trait :with_workshops do
      after(:create) do |festival|
        create_list(
          :session,
          3,
          :with_workshop,
          festival:,
          starts_at: festival.start_date.to_time + 10.hours,
        )
      end
    end
  end
end
