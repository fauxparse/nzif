FactoryBot.define do
  factory :festival do
    start_date { Date.new(2023, 10, 7) }
    end_date { start_date + 1.week }
  end
end
